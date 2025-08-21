# n8n-nodes-critique-api

This is an n8n community node that lets you use Critique AI in your workflows. Critique AI is an AI-powered search engine that dynamically searches the web, follows links, and recursively explores related topics to provide comprehensive, up-to-date responses.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

* **Search**: Perform AI-powered web search with optional image input, source filtering, and structured output formatting
* **Get Content**: Retrieve post-processed content from a webpage URL

## Credentials

This node requires Critique API credentials. You need:

* API Key: Your Critique API key from [Critique Labs](https://docs.critique-labs.ai/)

## Compatibility

* Minimum n8n version: 0.175.0
* Tested against n8n version: 1.0.0+

## Usage

### Search Operation

The search operation allows you to:
- Send text queries to Critique AI
- Include images (base64 encoded or URLs) for visual search
- Filter results by including/excluding specific domains
- Request structured output in JSON format
- Get comprehensive, up-to-date search results

Example search query: "What are the latest developments in AI for 2024?"

### Get Content Operation

Extract and process content from any webpage URL. Critique AI will:
- Retrieve the webpage content
- Process and clean the content
- Return structured, readable text

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Critique AI Documentation](https://docs.critique-labs.ai/)
* [Critique AI API Reference](https://docs.critique-labs.ai/api-reference/)

## License

[MIT](LICENSE.md)
