import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import LightningModal from 'lightning/modal';
import API_UPDATED_FIELD from '@salesforce/schema/Opportunity.API_Updated_Field__c';
import ACCOUNTID_FIELD from '@salesforce/schema/Opportunity.AccountId';
import OPPORTUNITY_ID_FIELD from '@salesforce/schema/Opportunity.Id';

export default class OpportunityWebhookSection extends LightningElement {
    @api recordId;
    webhookResponse;

    @wire(getRecord, { recordId: '$recordId', fields: [API_UPDATED_FIELD, ACCOUNTID_FIELD, OPPORTUNITY_ID_FIELD] })
    opportunity;

    get apiUpdatedField() {
        return getFieldValue(this.opportunity.data, API_UPDATED_FIELD);
    }

    async handleOpenModal() {
        const accountId = getFieldValue(this.opportunity.data, ACCOUNTID_FIELD);
        const opportunityId = getFieldValue(this.opportunity.data, OPPORTUNITY_ID_FIELD);
        console.log('Opening modal with account ID:', accountId);
        console.log('Opportunity ID:', opportunityId);
        const result = await LightningModal.open({
            component: 'c:opportunityWebhookModal',
            componentParams: {
                accountId: accountId || opportunityId,
                isOpportunityId: !accountId
            },
            label: 'Opportunity Details'
        });
        if (result) {
            this.webhookResponse = result;
        }
    }
}