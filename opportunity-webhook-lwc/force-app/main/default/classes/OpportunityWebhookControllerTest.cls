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
        System.assert(result.contains('"success": true'), 'Expected specific JSON response from sendToWebhook');
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
        String result = OpportunityWebhookController.getWebhookData(testAccount.Id, false);
        Test.stopTest();

        // Verify the results
        System.assert(result.contains('"field1": "value1"'), 'Expected specific JSON response from getWebhookData');
    }

    // Mock HTTP Callout
    private class WebhookCalloutMock implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            
            if (req.getEndpoint().contains('2a5e55ae-1be9-466c-8f9a-a6s8u91d32rn')) {
                // This is the getWebhookData call
                res.setBody('{"field1": "value1", "field2": "value2"}');
            } else if (req.getEndpoint().contains('c9401b41-936f-46be-8a26-794cc9ceb2e9')) {
                // This is the sendToWebhook call
                res.setBody('{"success": true, "message": "Account ID received"}');
            }
            
            res.setStatusCode(200);
            return res;
        }
    }
}