import type { Questionnaire } from 'fhir/r4';

export const sampleQuestionnaire: Questionnaire = {
  resourceType: 'Questionnaire',
  id: 'sample-questionnaire',
  title: 'Sample Patient Information Form',
  status: 'active',
  language: 'en',
  item: [
    {
      linkId: 'patient-info',
      text: 'Patient Information',
      type: 'group',
      item: [
        {
          linkId: 'first-name',
          text: 'First Name',
          type: 'string',
          required: true
        },
        {
          linkId: 'last-name',
          text: 'Last Name',
          type: 'string',
          required: true
        },
        {
          linkId: 'date-of-birth',
          text: 'Date of Birth',
          type: 'date',
          required: true
        },
        {
          linkId: 'gender',
          text: 'Gender',
          type: 'choice',
          answerOption: [
            {
              valueCoding: {
                code: 'male',
                display: 'Male'
              }
            },
            {
              valueCoding: {
                code: 'female',
                display: 'Female'
              }
            },
            {
              valueCoding: {
                code: 'other',
                display: 'Other'
              }
            }
          ]
        }
      ]
    },
    {
      linkId: 'contact-info',
      text: 'Contact Information',
      type: 'group',
      item: [
        {
          linkId: 'email',
          text: 'Email Address',
          type: 'string'
        },
        {
          linkId: 'phone',
          text: 'Phone Number',
          type: 'string'
        },
        {
          linkId: 'address',
          text: 'Address',
          type: 'text'
        }
      ]
    },
    {
      linkId: 'medical-history',
      text: 'Medical History',
      type: 'group',
      item: [
        {
          linkId: 'allergies',
          text: 'Do you have any allergies?',
          type: 'boolean'
        },
        {
          linkId: 'allergy-details',
          text: 'Please describe your allergies',
          type: 'text',
          enableWhen: [
            {
              question: 'allergies',
              operator: '=',
              answerBoolean: true
            }
          ]
        },
        {
          linkId: 'medications',
          text: 'Current Medications',
          type: 'text'
        },
        {
          linkId: 'smoking-status',
          text: 'Smoking Status',
          type: 'choice',
          answerOption: [
            {
              valueCoding: {
                code: 'never',
                display: 'Never smoked'
              }
            },
            {
              valueCoding: {
                code: 'former',
                display: 'Former smoker'
              }
            },
            {
              valueCoding: {
                code: 'current',
                display: 'Current smoker'
              }
            }
          ]
        }
      ]
    },
    {
      linkId: 'notes',
      text: 'Additional Notes',
      type: 'text'
    }
  ]
};

