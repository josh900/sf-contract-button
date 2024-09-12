import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import LightningModal from 'lightning/modal';
import API_UPDATED_FIELD from '@salesforce/schema/Opportunity.API_Updated_Field__c';
import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import CLOSEDATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
import STAGENAME_FIELD from '@salesforce/schema/Opportunity.StageName';
import ACCOUNTID_FIELD from '@salesforce/schema/Opportunity.AccountId';
import PROBABILITY_FIELD from '@salesforce/schema/Opportunity.Probability';

const FIELDS = [API_UPDATED_FIELD, NAME_FIELD, AMOUNT_FIELD, CLOSEDATE_FIELD, STAGENAME_FIELD, ACCOUNTID_FIELD, PROBABILITY_FIELD];

export default class OpportunityWebhookSection extends LightningElement {
    @api recordId;
    webhookResponse;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    opportunity;

    get apiUpdatedField() {
        return this.opportunity.data ? this.opportunity.data.fields.API_Updated_Field__c.value : '';
    }

    async handleOpenModal() {
        if (this.opportunity.data) {
            const result = await LightningModal.open({
                component: 'c:opportunityWebhookModal',
                componentParams: {
                    opportunityData: this.opportunity.data
                }
            });
            if (result) {
                this.webhookResponse = result;
            }
        }
    }
}