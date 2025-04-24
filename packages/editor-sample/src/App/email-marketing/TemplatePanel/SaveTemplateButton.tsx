/**
 * 2 loại save:
 * - Save template private
 * - Save template public
 * - Save template supper public (Hiện ở thanh sibar => Phải được quản trị viên duyệt)
 */
import React, { useState } from 'react';

import { IosShareOutlined } from '@mui/icons-material';
import { IconButton, Snackbar, Tooltip } from '@mui/material';

import { useDocument } from '../../../documents/editor/EditorContext';

export default function SaveButton() {
  const document = useDocument();
  const [message, setMessage] = useState<string | null>(null);

  const onClick = async () => {
    const c = encodeURIComponent(JSON.stringify(document));
    location.hash = `#code/${btoa(c)}`;
    setMessage('The URL was updated. Copy it to share your current template.');
  };

  const onClose = () => {
    setMessage(null);
  };

  return (
    <>
      <IconButton onClick={onClick}>
        <Tooltip title="Save this template">
          <IosShareOutlined fontSize="small" />
        </Tooltip>
      </IconButton>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message !== null}
        onClose={onClose}
        message={message}
      />
    </>
  );

  
}

export default function DownloadJson() {
  const doc = useDocument();
  const href = useMemo(() => {
    return `data:text/plain,${encodeURIComponent(JSON.stringify(doc, null, '  '))}`;
  }, [doc]);
  return (
    <Tooltip title="Download JSON file">
      <IconButton href={href} download="emailTemplate.json">
        <FileDownloadOutlined fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
