import React from 'react';

export default function VariableForm({ variables, data, setData }) {
  const handleChange = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="panel-title">Test Data</div>
      <div className="variables-list">
        {variables.length === 0 ? (
          <div className="empty-state">No variables detected yet.</div>
        ) : (
          variables.map((v) => (
            <div className="variable-item" key={v.name}>
              <label className="variable-label">{v.name}</label>
              <input
                type="text"
                value={data[v.name] || ''}
                onChange={(e) => handleChange(v.name, e.target.value)}
                placeholder={`Value for ${v.name}`}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
