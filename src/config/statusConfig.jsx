// statusConfig.js

export const statusStyles = {
    'OPEN': 'bg-status-open-light text-status-open',
    'ACCEPT': 'bg-status-accept-light text-status-accept',
    'REJECT': 'bg-status-reject-light text-status-reject',
    'APPROVED BY HOME': 'bg-status-approvedByHome-light text-status-approvedByHome',
    'APPROVED': 'bg-status-approved-light text-status-approved',
    'REALIZED': 'bg-status-realized-light text-status-realized',
    'MATCHED': 'bg-status-matched-light text-status-matched',
    'REJECTED': 'bg-status-reject-light text-status-reject',
    'WITHDRAWN': 'bg-status-withdrawn-light text-status-withdrawn',
    'FINISHED': 'bg-status-finished-light text-status-finished',
    'APPROVAL_BROKEN': 'bg-status-approvalBroken-light text-status-approvalBroken',
};

export const statusOptions = {
    'OPEN': [
        { label: 'OPEN', color: 'bg-status-open-light text-status-open' },
        { label: 'ACCEPT', color: 'bg-status-accept-light text-status-accept' },
        { label: 'REJECT', color: 'bg-status-reject-light text-status-reject' }
    ],
    'APPROVED BY HOME': [
        { label: 'APPROVED BY HOME', color: 'bg-status-approvedByHome-light text-status-approvedByHome' },
        { label: 'APPROVED', color: 'bg-status-approved-light text-status-approved' },
        { label: 'REJECT', color: 'bg-status-reject-light text-status-reject' }
    ],
    'APPROVED': [
        { label: 'APPROVED', color: 'bg-status-approved-light text-status-approved' },
        { label: 'REALIZED', color: 'bg-status-realized-light text-status-realized' }
    ],
    'REALIZED': [
        { label: 'REALIZED', color: 'bg-status-realized-light text-status-realized' }
    ],
    'MATCHED': [
        { label: 'MATCHED', color: 'bg-status-matched-light text-status-matched' }
    ],
    'REJECTED': [
        { label: 'REJECTED', color: 'bg-status-reject-light text-status-reject' }
    ],
    'WITHDRAWN': [
        { label: 'WITHDRAWN', color: 'bg-status-withdrawn-light text-status-withdrawn' }
    ],
    'FINISHED': [
        { label: 'FINISHED', color: 'bg-status-finished-light text-status-finished' }
    ],
    'APPROVAL_BROKEN': [
        { label: 'APPROVAL BROKEN', color: 'bg-status-approvalBroken-light text-status-approvalBroken' }
    ],
};
