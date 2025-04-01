import { MESSAGE_COPPY_SUCCESS } from '@/constants';
import { message } from 'antd';

export const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text || '').then(() => {
        message.success(MESSAGE_COPPY_SUCCESS);
    });
};