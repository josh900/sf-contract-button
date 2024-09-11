@isTest
private class OpportunityWebhookControllerTest {
    @isTest
    static void testSendToWebhook() {
        // Create test data
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;

        // Set up the mock callout
        Test.setMock(HttpCalloutMock.class, new WebhookCalloutMock());

        // Call the method to test
        Test.startTest();
        String result = OpportunityWebhookController.sendToWebhook(testAccount.Id);
        Test.stopTest();

        // Verify the results
        System.assert(result.contains('Webhook triggered successfully'), 'Expected successful webhook trigger');
    }

    @isTest
    static void testGetWebhookData() {
        // Create test data
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;

        // Set up the mock callout
        Test.setMock(HttpCalloutMock.class, new WebhookCalloutMock());

        // Call the method to test
        Test.startTest();
        String result = OpportunityWebhookController.getWebhookData(testAccount.Id);
        Test.stopTest();

        // Verify the results
        System.assert(result.contains('<h1>Webhook Data</h1>'), 'Expected HTML content from webhook');
    }

    // Mock HTTP Callout
    private class WebhookCalloutMock implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'text/html');
            res.setBody('<h1>Webhook Data</h1><p>Account ID: ' + req.getBody() + '</p>');
            res.setStatusCode(200);
            return res;
        }
    }
}