import {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CritiqueApiCredentialsApi implements ICredentialType {
	name = 'critiqueApi';
	displayName = 'Critique API';

	documentationUrl = 'https://docs.critique-labs.ai/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Critique API key',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.critique-labs.ai',
			url: '/v1/search',
			method: 'POST',
			headers: {
				'X-API-Key': '={{ $credentials.apiKey }}',
				'Content-Type': 'application/json',
			},
			body: {
				prompt: 'test',
			},
		},
	};
}
