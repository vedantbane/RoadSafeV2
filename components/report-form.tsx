'use client';

import { FormEvent, useState } from 'react';

const initialForm = {
  title: '',
  locationName: '',
  category: 'Pothole',
  severity: 'medium',
  description: '',
  reporterName: '',
  reporterEmail: '',
  reporterPhone: '',
};

export function ReportForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          title: form.title.trim(),
          locationName: form.locationName.trim(),
          description: form.description.trim(),
          reporterName: form.reporterName.trim() || undefined,
          reporterEmail: form.reporterEmail.trim() || '',
          reporterPhone: form.reporterPhone.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit report');
      }

      setStatus('success');
      setMessage('Report submitted successfully.');
      setForm(initialForm);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="report-form">
      <div className="field-grid">
        <div className="field">
          <label htmlFor="title">Issue title</label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Large pothole near bus stop"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            value={form.locationName}
            onChange={(e) => handleChange('locationName', e.target.value)}
            placeholder="Street, area, or landmark"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="Pothole">Pothole</option>
            <option value="Crack">Road Crack</option>
            <option value="Debris">Debris / Obstacle</option>
            <option value="Hazard">Open Manhole / Hazard</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="severity">Severity</label>
          <select
            id="severity"
            value={form.severity}
            onChange={(e) => handleChange('severity', e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="field full">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the issue, size, depth, and danger to vehicles or pedestrians"
            rows={5}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="reporterName">Reporter name</label>
          <input
            id="reporterName"
            value={form.reporterName}
            onChange={(e) => handleChange('reporterName', e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div className="field">
          <label htmlFor="reporterEmail">Email</label>
          <input
            id="reporterEmail"
            type="email"
            value={form.reporterEmail}
            onChange={(e) => handleChange('reporterEmail', e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div className="field">
          <label htmlFor="reporterPhone">Phone</label>
          <input
            id="reporterPhone"
            value={form.reporterPhone}
            onChange={(e) => handleChange('reporterPhone', e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>

      <button type="submit" className="primary-button" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting...' : 'Submit Report'}
      </button>

      {message ? (
        <p className={`form-message ${status === 'error' ? 'error' : 'success'}`}>{message}</p>
      ) : null}
    </form>
  );
}
