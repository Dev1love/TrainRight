import { useState } from 'react';
import { api } from '@/utils/api';

interface InviteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  inviteType: 'CLIENT' | 'TRAINER';
}

interface InviteData {
  email: string;
  name: string;
  message: string;
  role: 'CLIENT' | 'TRAINER';
}

export function InviteForm({ onSuccess, onCancel, inviteType }: InviteFormProps) {
  const [formData, setFormData] = useState<InviteData>({
    email: '',
    name: '',
    message: '',
    role: inviteType
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultMessages = {
    CLIENT: "I'd like to invite you to join TrainRight as my client. Together, we'll work on achieving your fitness goals.",
    TRAINER: "I'd like to invite you to join TrainRight as a trainer. Join our community of fitness professionals."
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Mock API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      // await api.post('/invitations', formData);
      onSuccess();
    } catch (err) {
      setError('Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invite-form">
      <div className="form-header">
        <h2>Invite {inviteType === 'CLIENT' ? 'Client' : 'Trainer'}</h2>
        <button onClick={onCancel} className="close-button">×</button>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Name (optional)</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Invitation Message</label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder={defaultMessages[inviteType]}
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Invitation'}
          </button>
        </div>
      </form>
    </div>
  );
} 