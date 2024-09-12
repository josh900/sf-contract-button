public with sharing class OpportunityWebhookController {
    @AuraEnabled
    public static String sendToWebhook(Id accountId) {
        System.debug('Entering sendToWebhook method with accountId: ' + accountId);
        String webhookUrl = 'https://n8n.skoop.digital/webhook/2a5e55ae-1be9-466c-8f9a-a6s8u91d32rn';
        
        Map<String, String> payload = new Map<String, String>{
            'accountId' => accountId
        };
        String jsonBody = JSON.serialize(payload);
        System.debug('Payload to be sent: ' + jsonBody);
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(webhookUrl);
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json');
        request.setBody(jsonBody);
        
        try {
            HttpResponse response = http.send(request);
            System.debug('Response status code: ' + response.getStatusCode());
            System.debug('Response body: ' + response.getBody());
            
            if (response.getStatusCode() == 200) {
                return 'Webhook triggered successfully. Response: ' + response.getBody();
            } else {
                return 'Webhook failed. Status: ' + response.getStatus() + '. Response: ' + response.getBody();
            }
        } catch (Exception e) {
            System.debug('Exception occurred: ' + e.getMessage());
            return 'Error: ' + e.getMessage();
        }
    }
    
    @AuraEnabled
    public static String getWebhookData(Id id, Boolean isOpportunityId) {
        String webhookUrl = 'https://n8n.skoop.digital/webhook/2a5e55ae-1be9-466c-8f9a-a6a7391d305e';
        
        Map<String, Object> payload = new Map<String, Object>{
            'id' => id,
            'isOpportunityId' => isOpportunityId
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
            return response.getBody();
        } else {
            return '<p>Error fetching data from webhook. Status: ' + response.getStatus() + '</p>';
        }
    }
}