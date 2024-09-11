public with sharing class OpportunityWebhookController {
    @AuraEnabled
    public static String sendToWebhook(Id accountId) {
        String webhookUrl = 'https://n8n.skoop.digital/webhook/2a5e55ae-1be9-466c-8f9a-as6t391d3d8w';
        
        Map<String, String> payload = new Map<String, String>{
            'accountId' => accountId
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
    public static String getWebhookData(Id accountId) {
        String webhookUrl = 'https://n8n.skoop.digital/webhook-test/2a5e55ae-1be9-466c-8f9a-a6s8u91d32rn';
        
        Map<String, String> payload = new Map<String, String>{
            'accountId' => accountId
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