public with sharing class OpportunityWebhookController {
    private static final String WEBHOOK_URL = 'https://n8n.skoop.digital/webhook/2a5e55ae-1be9-466c-8f9a-a6s8u91d32rn';

    @AuraEnabled
    public static String getWebhookData(Id id, Boolean isOpportunityId) {
        System.debug('getWebhookData called with id: ' + id + ', isOpportunityId: ' + isOpportunityId);
        
        String result;
        if (isOpportunityId) {
            result = sendToWebhook(id);
        } else {
            result = sendToWebhook(id);
        }
        
        System.debug('Webhook response: ' + result);
        return result;
    }

    private static String sendToWebhook(Id recordId) {
        System.debug('sendToWebhook called with recordId: ' + recordId);
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint(WEBHOOK_URL);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        
        Map<String, Object> bodyMap = new Map<String, Object>();
        bodyMap.put('recordId', recordId);
        bodyMap.put('objectType', recordId.getSObjectType().getDescribe().getName());
        
        req.setBody(JSON.serialize(bodyMap));
        
        System.debug('Sending request to webhook: ' + req);
        
        Http http = new Http();
        HTTPResponse res = http.send(req);
        
        System.debug('Webhook response status: ' + res.getStatusCode());
        System.debug('Webhook response body: ' + res.getBody());
        
        if (res.getStatusCode() == 200) {
            return res.getBody();
        } else {
            return '<p>Error: Unable to fetch data from webhook. Status code: ' + res.getStatusCode() + '</p>';
        }
    }
}