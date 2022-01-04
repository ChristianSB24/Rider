import React from 'react';

interface msg {
    msg: string
}

export default ({ msg }: msg) => {
  return (
    <div className="is-invalid invalid-feedback">
      {msg}
    </div>
  )
};