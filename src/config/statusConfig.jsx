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
};

export const statusOptions = {
    'OPEN': [
        { label: 'OPEN', color: 'bg-status-open-light text-status-open' },
        { label: 'ACCEPTED', color: 'bg-status-accept-light text-status-accept' },
        { label: 'REJECTED', color: 'bg-status-reject-light text-status-reject' }
    ],
    'ACCEPTED BY HOST': [
        { label: 'ACCEPTED BY HOST', color: 'bg-status-acceptedByHost-light text-status-acceptedByHost' },
        { label: 'APPROVED BY HOME', color: 'bg-status-approvedByHome-light text-status-approvedByHome' },
        { label: 'APPROVED BY HOST', color: 'bg-status-approvedByHost-light text-status-approvedByHost' },
        { label: 'REJECTED', color: 'bg-status-reject-light text-status-reject' }
    ],
    'APPROVED BY HOME': [
        { label: 'APPROVED BY HOME', color: 'bg-status-approvedByHome-light text-status-approvedByHome' },
        { label: 'APPROVED', color: 'bg-status-approved-light text-status-approved' },
        { label: 'REJECTED', color: 'bg-status-reject-light text-status-reject' }
    ],
    'APPROVED BY HOST': [
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
    'ACCEPTANCE BROKEN': [
        { label: 'ACCEPTANCE BROKEN', color: 'bg-status-acceptanceBroken-light text-status-acceptanceBroken' }
    ],
    'APPROVAL BROKEN': [
        { label: 'APPROVAL BROKEN', color: 'bg-status-approvalBroken-light text-status-approvalBroken' }
    ],
    'REALIZATION BROKEN': [
        { label: 'REALIZATION BROKEN', color: 'bg-status-realizationBroken-light text-status-realizationBroken' }
    ],
    'REMOTE REALIZATION BROKEN': [
        { label: 'REMOTE REALIZATION BROKEN', color: 'bg-status-remoteRealizationBroken-light text-status-remoteRealizationBroken' }
    ],
    'ACCEPTED': [
        { label: 'ACCEPTED', color: 'bg-status-accept-light text-status-accept' }
    ],
};
