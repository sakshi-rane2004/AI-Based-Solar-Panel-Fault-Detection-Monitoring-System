import { useState, useEffect } from 'react';
import { plantAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const PlantManagement = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacityKW: ''
  });

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await plantAPI.getAllPlants();
      setPlants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const plantData = {
        name: formData.name,
        location: formData.location,
        capacityKW: parseFloat(formData.capacityKW)
      };

      if (editingPlant) {
        await plantAPI.updatePlant(editingPlant.id, plantData);
      } else {
        await plantAPI.createPlant(plantData);
      }

      setShowForm(false);
      setEditingPlant(null);
      setFormData({ name: '', location: '', capacityKW: '' });
      fetchPlants();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (plant) => {
    setEditingPlant(plant);
    setFormData({
      name: plant.name,
      location: plant.location,
      capacityKW: plant.capacityKW.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plant? All associated panels will also be deleted.')) {
      return;
    }

    try {
      setError(null);
      await plantAPI.deletePlant(id);
      fetchPlants();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPlant(null);
    setFormData({ name: '', location: '', capacityKW: '' });
    setError(null);
  };

  if (loading) {
    return <LoadingSpinner message="Loading plants..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Solar Plant Management</h1>
          <p className="page-subtitle">Manage solar power plants and their configurations</p>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Add New Plant
          </button>
        </div>
      </div>

      <ErrorAlert error={error} />

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>{editingPlant ? 'Edit Plant' : 'Add New Plant'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Plant Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., Solar Farm A"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., California, USA"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Capacity (kW) *</label>
              <input
                type="number"
                name="capacityKW"
                value={formData.capacityKW}
                onChange={handleInputChange}
                className="form-control"
                placeholder="e.g., 5000"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary">
                {editingPlant ? 'Update Plant' : 'Create Plant'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3>All Plants ({plants.length})</h3>
        
        {plants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏭</div>
            <h3>No Plants Found</h3>
            <p>Click "Add New Plant" to create your first solar power plant.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Capacity (kW)</th>
                  <th>Panels</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plants.map(plant => (
                  <tr key={plant.id}>
                    <td>{plant.id}</td>
                    <td><strong>{plant.name}</strong></td>
                    <td>{plant.location}</td>
                    <td>{plant.capacityKW.toLocaleString()} kW</td>
                    <td>
                      <span className="badge badge-info">{plant.panelCount || 0} panels</span>
                    </td>
                    <td>{new Date(plant.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleEdit(plant)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(plant.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantManagement;
