export const analyzeTemplate = async (template) => {
    const response = await fetch('http://localhost:8080/api/template/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template, data: {} })
    });
    if (!response.ok) throw new Error('Failed to analyze template');
    return response.json();
};

export const renderTemplate = async (template, data) => {
    const response = await fetch('http://localhost:8080/api/template/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template, data })
    });
    if (!response.ok) throw new Error('Failed to render template');
    return response.json();
};
