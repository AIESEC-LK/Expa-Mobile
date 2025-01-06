// statusConfig.js

export const statusStyles = {
    'OPEN': 'bg-status-open-light text-status-open',
    'ACCEPTED BY HOST': 'bg-status-acceptedByHost-light text-status-acceptedByHost',
    'ACCEPTED': 'bg-status-accept-light text-status-accept',
    'APPROVED_BY_HOME': 'bg-status-approvedByHome-light text-status-approvedByHome',
    'APPROVED_BY_HOST': 'bg-status-approvedByHost-light text-status-approvedByHost',
    'APPROVED': 'bg-status-approved-light text-status-approved',
    'REMOTE_REALIZED': 'bg-status-remoteRealized-light text-status-remoteRealized',
    'REALIZED': 'bg-status-realized-light text-status-realized',
    'FINISHED': 'bg-status-finished-light text-status-finished',
    'COMPLETED': 'bg-status-finished-light text-status-completed',
    'REJECTED': 'bg-status-reject-light text-status-reject',
    'DECLINED': 'bg-status-reject-light text-status-reject',
    'ACCEPTANCE_BROKEN': 'bg-status-acceptanceBroken-light text-status-acceptanceBroken',
    'APPROVAL_BROKEN': 'bg-status-approvalBroken-light text-status-approvalBroken',
    'REALIZATION_BROKEN': 'bg-status-realizationBroken-light text-status-realizationBroken',
    'WITHDRAWN': 'bg-status-withdrawn-light text-status-withdrawn',
    'REMOTE_REALIZATION_BROKEN': 'bg-status-remoteRealizationBroken-light text-status-remoteRealizationBroken',
};

export const statusOptions = {
    'OPEN': [
        { label: 'ACCEPTED', color: 'bg-status-accept-light text-status-accept' },
        { label: 'REJECTED', color: 'bg-status-reject-light text-status-reject' }
    ],
    'ACCEPTED_BY_HOST': [
        { label: 'ACCEPTED BY HOST', color: 'bg-status-acceptedByHost-light text-status-acceptedByHost' },
        { label: 'APPROVED BY HOME', color: 'bg-status-approvedByHome-light text-status-approvedByHome' },
        { label: 'APPROVED BY HOST', color: 'bg-status-approvedByHost-light text-status-approvedByHost' },
        { label: 'REJECTED', color: 'bg-status-reject-light text-status-reject' }
    ],
    'APPROVED_BY_HOME': [
        { label: 'APPROVED BY HOME', color: 'bg-status-approvedByHome-light text-status-approvedByHome' },
        { label: 'APPROVED', color: 'bg-status-approved-light text-status-approved' },
        { label: 'REJECTED', color: 'bg-status-reject-light text-status-reject' }
    ],
    'APPROVED_BY_HOST': [
        { label: 'APPROVED BY HOST', color: 'bg-status-approvedByHost-light text-status-approvedByHost' },
        { label: 'APPROVED', color: 'bg-status-approved-light text-status-approved' },
        { label: 'REJECTED', color: 'bg-status-reject-light text-status-reject' }
    ],
    'APPROVED': [
        { label: 'APPROVED', color: 'bg-status-approved-light text-status-approved' },
        { label: 'REALIZED', color: 'bg-status-realized-light text-status-realized' }
    ],
    'REALIZED': [
        { label: 'REALIZED', color: 'bg-status-realized-light text-status-realized' },
        { label: 'REMOTE REALIZED', color: 'bg-status-remoteRealized-light text-status-remoteRealized' }
    ],
    'MATCHED': [
        { label: 'MATCHED', color: 'bg-status-matched-light text-status-matched' }
    ],
    'REJECTED': [
        { label: 'REJECTED', color: 'bg-status-reject-light text-status-reject' }
    ],
    'DECLINED': [
        { label: 'DECLINED', color: 'bg-status-reject-light text-status-reject' }
    ],
    'WITHDRAWN': [
        { label: 'WITHDRAWN', color: 'bg-status-withdrawn-light text-status-withdrawn' }
    ],
    'FINISHED': [
        { label: 'FINISHED', color: 'bg-status-finished-light text-status-finished' }
    ],
    'COMPLETED': [
        { label: 'COMPLETED', color: 'bg-status-finished-light text-status-completed' }
    ],
    'ACCEPTANCE_BROKEN': [
        { label: 'ACCEPTANCE BROKEN', color: 'bg-status-acceptanceBroken-light text-status-acceptanceBroken' }
    ],
    'APPROVAL_BROKEN': [
        { label: 'APPROVAL BROKEN', color: 'bg-status-approvalBroken-light text-status-approvalBroken' }
    ],
    'REALIZATION_BROKEN': [
        { label: 'REALIZATION BROKEN', color: 'bg-status-realizationBroken-light text-status-realizationBroken' }
    ],
    'REMOTE_REALIZATION_BROKEN': [
        { label: 'REMOTE REALIZATION BROKEN', color: 'bg-status-remoteRealizationBroken-light text-status-remoteRealizationBroken' }
    ],
    'ACCEPTED': [
        { label: 'ACCEPTED', color: 'bg-status-accept-light text-status-accept' }
    ],
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


