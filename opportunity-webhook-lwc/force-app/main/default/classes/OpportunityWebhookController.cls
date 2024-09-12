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
    public static String getWebhookData(Id id, Boolean isOpportunityId) {
        System.debug('getWebhookData called with id: ' + id + ', isOpportunityId: ' + isOpportunityId);
        
        String endpoint = 'https://n8n.skoop.digital/webhook/2a5e55ae-1be9-466c-8f9a-a6s8u91d32rn';
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        
        Map<String, Object> bodyMap = new Map<String, Object>();
        bodyMap.put('id', id);
        bodyMap.put('isOpportunityId', isOpportunityId);
        
        req.setBody(JSON.serialize(bodyMap));
        
        Http http = new Http();
        HTTPResponse res;
        
        try {
            res = http.send(req);
            System.debug('Webhook response status: ' + res.getStatusCode());
            System.debug('Webhook response body: ' + res.getBody());
            
            if (res.getStatusCode() == 200) {
                return res.getBody();
            } else {
                return '<p>Error: Webhook returned status code ' + res.getStatusCode() + '</p>';
            }
        } catch(Exception e) {
            System.debug('Error calling webhook: ' + e.getMessage());
            return '<p>Error: ' + e.getMessage() + '</p>';
        }
    }
}