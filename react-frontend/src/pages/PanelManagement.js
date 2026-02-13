import { useState, useEffect } from 'react';
import { panelAPI, plantAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const PanelManagement = () => {
  const [panels, setPanels] = useState([]);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPanel, setEditingPanel] = useState(null);
  const [filterPlantId, setFilterPlantId] = useState('all');
  const [formData, setFormData] = useState({
    panelId: '',
    plantId: '',
    installationDate: '',
    capacity: '',
    status: 'ACTIVE',
    assignedTechnicianId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [panelsData, plantsData] = await Promise.all([
        panelAPI.getAllPanels(),
        plantAPI.getAllPlants()
      ]);
      setPanels(panelsData);
      setPlants(plantsData);
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
      const panelData = {
        panelId: formData.panelId,
        plantId: parseInt(formData.plantId),
        installationDate: formData.installationDate,
        capacity: parseFloat(formData.capacity),
        status: formData.status,
        assignedTechnicianId: formData.assignedTechnicianId ? parseInt(formData.assignedTechnicianId) : null
      };

      if (editingPanel) {
        await panelAPI.updatePanel(editingPanel.id, panelData);
      } else {
        await panelAPI.createPanel(panelData);
      }

      setShowForm(false);
      setEditingPanel(null);
      setFormData({
        panelId: '',
        plantId: '',
        installationDate: '',
        capacity: '',
        status: 'ACTIVE',
        assignedTechnicianId: ''
      });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (panel) => {
    setEditingPanel(panel);
    setFormData({
      panelId: panel.panelId,
      plantId: panel.plantId.toString(),
      installationDate: panel.installationDate,
      capacity: panel.capacity.toString(),
      status: panel.status,
      assignedTechnicianId: panel.assignedTechnicianId ? panel.assignedTechnicianId.toString() : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this panel?')) {
      return;
    }

    try {
      setError(null);
      await panelAPI.deletePanel(id);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPanel(null);
    setFormData({
      panelId: '',
      plantId: '',
      installationDate: '',
      capacity: '',
      status: 'ACTIVE',
      assignedTechnicianId: ''
    });
    setError(null);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'ACTIVE': return 'badge-success';
      case 'MAINTENANCE': return 'badge-warning';
      case 'OFFLINE': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const filteredPanels = filterPlantId === 'all' 
    ? panels 
    : panels.filter(p => p.plantId === parseInt(filterPlantId));

  if (loading) {
    return <LoadingSpinner message="Loading panels..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Solar Panel Management</h1>
          <p className="page-subtitle">Manage individual solar panels and their status</p>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
            disabled={plants.length === 0}
          >
            + Add New Panel
          </button>
        </div>
      </div>

      {plants.length === 0 && (
        <div className="alert alert-warning">
          Please create a solar plant first before adding panels.
        </div>
      )}

      <ErrorAlert error={error} />

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3>{editingPanel ? 'Edit Panel' : 'Add New Panel'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Panel ID *</label>
                <input
                  type="text"
                  name="panelId"
                  value={formData.panelId}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., P001"
                  required
                  disabled={editingPanel !== null}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Plant *</label>
                <select
                  name="plantId"
                  value={formData.plantId}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Plant</option>
                  {plants.map(plant => (
                    <option key={plant.id} value={plant.id}>
                      {plant.name} - {plant.location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Installation Date *</label>
                <input
                  type="date"
                  name="installationDate"
                  value={formData.installationDate}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Capacity (W) *</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., 350"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="ACTIVE">Active</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="OFFLINE">Offline</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assigned Technician ID</label>
                <input
                  type="number"
                  name="assignedTechnicianId"
                  value={formData.assignedTechnicianId}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary">
                {editingPanel ? 'Update Panel' : 'Create Panel'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>All Panels ({filteredPanels.length})</h3>
          <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
            <select
              value={filterPlantId}
              onChange={(e) => setFilterPlantId(e.target.value)}
              className="form-control"
            >
              <option value="all">All Plants</option>
              {plants.map(plant => (
                <option key={plant.id} value={plant.id}>
                  {plant.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {filteredPanels.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">☀️</div>
            <h3>No Panels Found</h3>
            <p>Click "Add New Panel" to register your first solar panel.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Panel ID</th>
                  <th>Plant</th>
                  <th>Installation Date</th>
                  <th>Capacity (W)</th>
                  <th>Status</th>
                  <th>Technician</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPanels.map(panel => (
                  <tr key={panel.id}>
                    <td><strong>{panel.panelId}</strong></td>
                    <td>{panel.plantName}</td>
                    <td>{new Date(panel.installationDate).toLocaleDateString()}</td>
                    <td>{panel.capacity.toLocaleString()} W</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(panel.status)}`}>
                        {panel.status}
                      </span>
                    </td>
                    <td>{panel.assignedTechnicianId || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleEdit(panel)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(panel.id)}
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

export default PanelManagement;
