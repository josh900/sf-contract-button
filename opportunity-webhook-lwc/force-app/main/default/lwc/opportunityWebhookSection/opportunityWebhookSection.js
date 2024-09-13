import { LightningElement, api, track, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import OpportunityWebhookModal from 'c/opportunityWebhookModal';
import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import CLOSEDATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
import STAGENAME_FIELD from '@salesforce/schema/Opportunity.StageName';
import ACCOUNTID_FIELD from '@salesforce/schema/Opportunity.AccountId';
import PROBABILITY_FIELD from '@salesforce/schema/Opportunity.Probability';
import API_UPDATED_FIELD from '@salesforce/schema/Opportunity.API_Updated_Field__c';
import CONTRACT_URL_FIELD from '@salesforce/schema/Opportunity.contract_url__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OpportunityWebhookSection extends LightningElement {
    @track isModalOpen = false;
    @api recordId; // This is the opportunity ID
    webhookResponse;
    error;
    isLoading = true;
    opportunityData;

    @wire(getRecord, { 
        recordId: '$recordId', 
        fields: [NAME_FIELD, AMOUNT_FIELD, CLOSEDATE_FIELD, STAGENAME_FIELD, ACCOUNTID_FIELD, PROBABILITY_FIELD, API_UPDATED_FIELD, CONTRACT_URL_FIELD] 
    })
    wiredOpportunity({ error, data }) {
        if (data) {
            console.log('Opportunity data loaded:', JSON.stringify(data));
            this.opportunityData = data;
            this.error = undefined;
        } else if (error) {
            console.error('Error loading opportunity data:', JSON.stringify(error));
            this.error = error;
            this.opportunityData = undefined;
        }
        this.isLoading = false;
    }

    get statusLabel() {
        return 'Status: ';
    }

    get apiUpdatedField() {
        return this.opportunityData ? getFieldValue(this.opportunityData, API_UPDATED_FIELD) : '';
    }

    get contractUrl() {
        return this.opportunityData ? getFieldValue(this.opportunityData, CONTRACT_URL_FIELD) : '';
    }

    get opportunityFields() {
        if (!this.opportunityData) return [];
        return [
            { label: 'Name', value: getFieldValue(this.opportunityData, NAME_FIELD) },
            { label: 'Amount', value: getFieldValue(this.opportunityData, AMOUNT_FIELD) },
            { label: 'Close Date', value: getFieldValue(this.opportunityData, CLOSEDATE_FIELD) },
            { label: 'Stage', value: getFieldValue(this.opportunityData, STAGENAME_FIELD) },
            { label: 'Account ID', value: getFieldValue(this.opportunityData, ACCOUNTID_FIELD) },
            { label: 'Probability', value: getFieldValue(this.opportunityData, PROBABILITY_FIELD) }
        ];
    }

    async handleOpenModal() {
        console.log('handleOpenModal called, opportunityData:', JSON.stringify(this.opportunityData));
        if (this.isLoading) {
            console.log('Data is still loading. Please wait.');
            return;
        }

        if (this.error) {
            console.error('Error loading opportunity data:', JSON.stringify(this.error));
            return;
        }

        if (!this.opportunityData) {
            console.error('Opportunity data not loaded yet');
            return;
        }

        const accountId = getFieldValue(this.opportunityData, ACCOUNTID_FIELD);
        console.log('Opening modal with opportunity ID:', this.recordId);

        try {
            console.log('Attempting to open modal...');
            const result = await OpportunityWebhookModal.open({
                size: 'large',
                description: 'Contract Preview Modal',
                content: {
                    opportunityFields: this.opportunityFields,
                    accountId: accountId,
                    opportunityId: this.recordId
                }
            });
            console.log('Modal opened successfully');
            console.log('Modal result:', JSON.stringify(result));
            if (result) {
                this.webhookResponse = result;
            }
        } catch (error) {
            console.error('Error opening modal:', JSON.stringify(error));
        }
    }

    handleOpenModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    async handleSubmitContract() {
        try {
            const response = await fetch('https://n8n.skoop.digital/webhook/2a5e55ae-1be9-466c-8f9a-as6t391d3d8w', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ opportunityId: this.recordId }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit contract');
            }

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contract submitted successfully',
                    variant: 'success',
                })
            );

            this.closeModal();
        } catch (error) {
            console.error('Error submitting contract:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Failed to submit contract',
                    variant: 'error',
                })
            );
        }
    }
}