import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class CritiqueApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Critique API',
		name: 'critiqueApi',
		group: ['productivity'],
		version: 1,
		description: 'Interact with Critique AI search and content API',
		defaults: {
			name: 'Critique API',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'critiqueApi',
				required: true,
			},
		],
		//usableAsTool: true,
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Search',
						value: 'search',
						description: 'Perform an AI-powered search',
						action: 'Search with AI',
					},
					{
						name: 'Get Content',
						value: 'getContent',
						description: 'Get processed content from a webpage',
						action: 'Get webpage content',
					},
				],
				default: 'search',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
				default: '',
				required: true,
				placeholder: 'Enter your search query',
				description: 'The search query to send to Critique AI',
			},
			{
				displayName: 'Image',
				name: 'image',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
				default: '',
				placeholder: 'Base64 encoded image or image URL',
				description: 'Optional image to include with the search (base64 encoded or URL)',
			},
			{
				displayName: 'Source Blacklist',
				name: 'sourceBlacklist',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
				default: '',
				placeholder: 'domain1.com,domain2.com',
				description: 'Comma-separated list of domains to exclude from search results',
			},
			{
				displayName: 'Source Whitelist',
				name: 'sourceWhitelist',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
				default: '',
				placeholder: 'domain1.com,domain2.com',
				description: 'Comma-separated list of domains to include in search results',
			},
			{
				displayName: 'Output Format (JSON)',
				name: 'outputFormat',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
				default: '',
				placeholder: '{"key": "value"}',
				description: 'Optional structured output format specification',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getContent'],
					},
				},
				default: '',
				required: true,
				placeholder: 'https://example.com',
				description: 'The URL to get content from',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				const credentials = await this.getCredentials('critiqueApi', itemIndex);

				let requestOptions: IHttpRequestOptions;
				let responseData: any;

				if (operation === 'search') {
					const prompt = this.getNodeParameter('prompt', itemIndex) as string;
					const image = this.getNodeParameter('image', itemIndex) as string;
					const sourceBlacklist = this.getNodeParameter('sourceBlacklist', itemIndex) as string;
					const sourceWhitelist = this.getNodeParameter('sourceWhitelist', itemIndex) as string;
					const outputFormat = this.getNodeParameter('outputFormat', itemIndex) as string;

					const requestBody: any = {
						prompt,
					};

					if (image) {
						requestBody.image = image;
					}

					if (sourceBlacklist) {
						requestBody.source_blacklist = sourceBlacklist.split(',').map(s => s.trim());
					}

					if (sourceWhitelist) {
						requestBody.source_whitelist = sourceWhitelist.split(',').map(s => s.trim());
					}

					if (outputFormat) {
						try {
							requestBody.output_format = JSON.parse(outputFormat);
						} catch (error) {
							throw new NodeOperationError(this.getNode(), `Invalid JSON in output format: ${error.message}`, {
								itemIndex,
							});
						}
					}

					requestOptions = {
						method: 'POST',
						url: 'https://api.critique-labs.ai/v1/search',
						headers: {
							'X-API-Key': credentials.apiKey as string,
							'Content-Type': 'application/json',
						},
						body: requestBody,
						json: true,
					};

					responseData = await this.helpers.httpRequest(requestOptions);

				} else if (operation === 'getContent') {
					const url = this.getNodeParameter('url', itemIndex) as string;

					requestOptions = {
						method: 'POST',
						url: 'https://api.critique-labs.ai/v1/contents',
						headers: {
							'X-API-Key': credentials.apiKey as string,
							'Content-Type': 'application/json',
						},
						body: {
							url,
						},
						json: true,
					};

					responseData = await this.helpers.httpRequest(requestOptions);
				}

				returnData.push({
					json: responseData,
					pairedItem: itemIndex,
				});

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: itemIndex,
					});
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [returnData];
	}
}
