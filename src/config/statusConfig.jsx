// statusConfig.js

export const statusStyles = {
    'OPEN': 'bg-status-open-light text-status-open',
    'ACCEPTED BY HOST': 'bg-status-acceptedByHost-light text-status-acceptedByHost',
    'ACCEPTED': 'bg-status-accept-light text-status-accept',
    'APPROVED BY HOME': 'bg-status-approvedByHome-light text-status-approvedByHome',
    'APPROVED BY HOST': 'bg-status-approvedByHost-light text-status-approvedByHost',
    'APPROVED': 'bg-status-approved-light text-status-approved',
    'REMOTE REALIZED': 'bg-status-remoteRealized-light text-status-remoteRealized',
    'REALIZED': 'bg-status-realized-light text-status-realized',
    'FINISHED': 'bg-status-finished-light text-status-finished',
    'COMPLETED': 'bg-status-finished-light text-status-completed',
    'REJECTED': 'bg-status-reject-light text-status-reject',
    'DECLINED': 'bg-status-reject-light text-status-reject',
    'ACCEPTANCE BROKEN': 'bg-status-acceptanceBroken-light text-status-acceptanceBroken',
    'APPROVAL BROKEN': 'bg-status-approvalBroken-light text-status-approvalBroken',
    'REALIZATION BROKEN': 'bg-status-realizationBroken-light text-status-realizationBroken',
    'WITHDRAWN': 'bg-status-withdrawn-light text-status-withdrawn',
    'REMOTE REALIZATION BROKEN': 'bg-status-remoteRealizationBroken-light text-status-remoteRealizationBroken',
    'PAID FOR APPROVE': 'bg-status-open-light text-status-open',
};

export const statusLabels = {
    'APPROVED_TN_MANAGER': 'APPROVED BY HOST',
    'APPROVED_EP_MANAGER': 'APPROVED BY HOME',
    'MATCHED': 'ACCEPTED BY HOST',
    'ACCEPTANCE_BROKEN': 'ACCEPTANCE BROKEN',
    'APPROVAL_BROKEN': 'APPROVAL BROKEN',
    'REALIZATION_BROKEN': 'REALIZATION BROKEN',
    'REMOTE_REALIZATION_BROKEN': 'REMOTE REALIZATION BROKEN',
    'PAID': 'PAID FOR APPROVAL',
    'APPROVED_BY_HOST': 'APPROVED BY HOST',
}

export const statusOptions = {
    'OPEN': [
        { label: 'ACCEPT', flows: ['OGX', 'ICX'], color: 'bg-status-accept-light text-status-accept' },
        { label: 'REJECT', flows: ['ICX'], color: 'bg-status-reject-light text-status-reject' }, //only for ICX flow
        { label: 'WITHDRAW', flows: ['OGX'], color: 'bg-status-reject-light text-status-reject' } //only for OGX flow
    ],
    'MATCHED': [
        // { label: 'ACCEPTED', flows: ['ICX'], color: 'bg-status-approvedByHost-light text-status-approvedByHost' }, //only for ICX flow //TODO: Need to confirm if this status exists
        { label: 'REJECT', flows: ['ICX'], color: 'bg-status-reject-light text-status-reject' }, //only for ICX flow
        { label: 'WITHDRAW', flows: ['OGX'], color: 'bg-status-reject-light text-status-reject' } //Only for OGX flow
    ],
    'APPROVED BY HOME': [
        { label: 'APPROVED AS HOST', flows: ['ICX'], color: 'bg-status-approvedByHome-light text-status-approvedByHome'}, //only for ICX flow
        { label: 'REJECT', flows: ['ICX'], color: 'bg-status-reject-light text-status-reject' } //only for ICX flow
    ],
    'APPROVED': [
        // { label: 'REALIZE', flows: ['ICX'], color: 'bg-status-realized-light text-status-realized' }, //only for ICX flow //Need to check if can be realized // need to show the error
    ],
    'REALIZED': [
        // { label: 'FINISH', flows: ['ICX'], color: 'bg-status-finished-light text-status-finished' } //only for ICX flow
    ],
    'REJECTED': [
        { label: 'UNREJECT', flows: ['ICX'], color: 'bg-status-open-light text-status-open' } //only for ICX flow
    ],
    'WITHDRAWN': [
        { label: 'OPEN', flows: ['OGX'], color: 'bg-status-reject-light text-status-reject' } //only for OGX flow
    ],
    'FINISHED': [
        // { label: 'FINISHED', color: 'bg-status-finished-light text-status-finished' }
    ],
    'COMPLETED': [

    ],
    'ACCEPTANCE BROKEN': [

    ],
    'APPROVAL BROKEN': [
    ],
    'ACCEPTED BY HOST': [
    ],
    'REALIZATION BROKEN': [
    ],
    'REMOTE REALIZATION BROKEN': [
    ],
    'ACCEPTED': [
        // { label: 'WITHDRAW', flows: ['OGX'], color: 'bg-status-reject-light text-status-reject' }, //only for OGX flow
        { label: 'PAID FOR APPROVE', flows: ['OGX'], color: 'bg-status-open-light text-status-open' }, //OGX flow does not have this status
    ],
    'APPROVED BY HOST': [
        { label: 'REJECT', flows: ['ICX'], color: 'bg-status-reject-light text-status-reject' }, //only for OGX flow
    ],
    'PAID FOR APPROVAL':[
        { label: 'APPROVE AS HOME', flows: ['OGX'], color: 'bg-status-realized-light text-status-realized' }, //only for OGX flow
    ]
};

export const rejectionReasons = {
    '1': { reason: 'Project is canceled', id: 20851 },
    '2': { reason: 'AIESEC is unresponsive', id: 20850 },
    '3': { reason: 'Partner is unresponsive', id: 20849 },
    '4': { reason: 'EP is unresponsive', id: 20848 },
    '5': { reason: 'Problem with the timeline or realization date', id: 20847 },
    '6': { reason: 'Required citizenship not matching', id: 20846 },
    '7': { reason: 'Poor language proficiency', id: 20845 },
    '8': { reason: 'Lack of professional experience', id: 20844 },
    '9': { reason: 'Position is filled', id: 20843 },
    '10': { reason: 'Skills are not suitable', id: 20842 },
    '11': { reason: 'The background is not suitable', id: 20841 },
    '12': { reason: 'Incomplete/low quality of CV/profile', id: 20840 }
};


