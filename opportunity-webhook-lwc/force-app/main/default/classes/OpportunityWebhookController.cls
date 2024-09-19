public with sharing class OpportunityWebhookController {
    @AuraEnabled
    public static String sendToWebhook(Id opportunityId) {
        String webhookUrl = 'https://n8n.skoop.digital/webhook/c9401b41-936f-46be-8a26-794cc9ceb2e9';
        
        Map<String, String> payload = new Map<String, String>{
            'opportunityId' => opportunityId
        };
        String jsonBody = JSON.serialize(payload);
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(webhookUrl);
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json');
        request.setBody(jsonBody);
        
        HttpResponse response = http.send(request);
        
        if (response.getStatusCode() == 200) {
            return 'Webhook triggered successfully. Response: ' + response.getBody();
        } else {
            return 'Webhook failed. Status: ' + response.getStatus() + '. Response: ' + response.getBody();
        }
    }
    
    @AuraEnabled
    public static String getWebhookData(Id id, Boolean isOpportunityId) {
        try {
            String endpoint = 'https://n8n.skoop.digital/webhook/2a5e55ae-1be9-466c-8f9a-a6s8u91d32rn';
            
            Map<String, Object> requestBody = new Map<String, Object>{
                'isOpportunityId' => isOpportunityId,
                'id' => id
            };

            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint(endpoint);
            request.setMethod('POST');
            request.setHeader('Content-Type', 'application/json');
            request.setBody(JSON.serialize(requestBody));

            HttpResponse response = http.send(request);

            if (response.getStatusCode() == 200) {
                return response.getBody();
            } else {
                throw new AuraHandledException('HTTP request failed with status code: ' + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error in getWebhookData: ' + e.getMessage());
        }
    }
}