import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import LightningModal from 'lightning/modal';
import API_UPDATED_FIELD from '@salesforce/schema/Opportunity.API_Updated_Field__c';
import ACCOUNTID_FIELD from '@salesforce/schema/Opportunity.AccountId';
import OPPORTUNITY_ID_FIELD from '@salesforce/schema/Opportunity.Id';

export default class OpportunityWebhookSection extends LightningElement {
    @api recordId;
    webhookResponse;
    opportunityData;

    @wire(getRecord, { recordId: '$recordId', fields: [API_UPDATED_FIELD, ACCOUNTID_FIELD, OPPORTUNITY_ID_FIELD] })
    wiredOpportunity({ error, data }) {
        if (data) {
            this.opportunityData = data;
        } else if (error) {
            console.error('Error loading opportunity data:', error);
        }
    }

    get apiUpdatedField() {
        return this.opportunityData ? getFieldValue(this.opportunityData, API_UPDATED_FIELD) : '';
    }

    async handleOpenModal() {
        if (!this.opportunityData) {
            console.error('Opportunity data not loaded yet');
            return;
        }

        const accountId = getFieldValue(this.opportunityData, ACCOUNTID_FIELD);
        const opportunityId = getFieldValue(this.opportunityData, OPPORTUNITY_ID_FIELD);
        console.log('Opening modal with account ID:', accountId);
        console.log('Opportunity ID:', opportunityId);

        if (!accountId && !opportunityId) {
            console.error('Neither Account ID nor Opportunity ID available');
            return;
        }

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