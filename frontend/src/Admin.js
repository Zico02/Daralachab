import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Search,
  Calendar,
  User,
  Phone,
  Mail,
  Users,
  MessageSquare,
  LogOut,
  Trash2,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import './Admin.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const PRICE_PER_PERSON = 200;

function Admin() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // all, today, tomorrow, future
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Restore admin key from sessionStorage
  useEffect(() => {
    const storedKey = sessionStorage.getItem('admin_key');
    if (storedKey) {
      setAdminKey(storedKey);
      setIsAuthenticated(true);
      fetchReservations(storedKey);
    }
  }, []);

  const normalizeReservations = (list) =>
    list.map((r) => ({
      ...r,
      status: r.status || 'en_attente',
    }));

  const handleLogin = async () => {
    if (!adminKey.trim()) {
      toast.error('Veuillez entrer une clé admin');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations`, {
        headers: {
          'x-admin-key': adminKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_key', adminKey);
        setReservations(normalizeReservations(data));
        toast.success('Connexion réussie');
      } else if (response.status === 401) {
        toast.error('Clé admin invalide');
      } else {
        throw new Error('Erreur de connexion');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey('');
    sessionStorage.removeItem('admin_key');
    setReservations([]);
    toast.success('Déconnexion réussie');
  };

  const fetchReservations = async (key) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations`, {
        headers: {
          'x-admin-key': key,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(normalizeReservations(data));
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('admin_key');
        toast.error('Clé admin expirée ou invalide');
      } else {
        throw new Error('Erreur lors de la récupération des réservations');
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (isAuthenticated) {
      fetchReservations(adminKey);
    }
  };

  // ---------- STATUS UPDATE ----------

  const updateStatus = async (reservationId, newStatus) => {
    if (!adminKey) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reservations/${reservationId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-key': adminKey,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        const updated = await response.json();
        setReservations((prev) =>
          normalizeReservations(
            prev.map((r) => (r.id === updated.id ? updated : r))
          )
        );
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('admin_key');
        toast.error('Clé admin expirée ou invalide');
      } else {
        throw new Error('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // ---------- PERSONS EDIT ----------

  const handlePersonsChange = (reservationId, value) => {
    const cleaned =
      value === '' ? '' : Math.max(0, parseInt(value, 10) || 0);

    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId ? { ...r, persons: cleaned } : r
      )
    );
  };

  const savePersonsEdit = async (reservationId, value) => {
    if (!adminKey) return;
    const personsInt = parseInt(value, 10);
    if (Number.isNaN(personsInt) || personsInt < 0) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reservations/${reservationId}/persons`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-key': adminKey,
          },
          body: JSON.stringify({ persons: personsInt }),
        }
      );

      if (response.ok) {
        const updated = await response.json();
        setReservations((prev) =>
          normalizeReservations(
            prev.map((r) => (r.id === updated.id ? updated : r))
          )
        );
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('admin_key');
        toast.error('Clé admin expirée ou invalide');
      } else {
        throw new Error('Erreur lors de la mise à jour du nombre de personnes');
      }
    } catch (error) {
      console.error('Error updating persons:', error);
      toast.error(
        'Erreur de connexion au serveur lors de la mise à jour du nombre de personnes'
      );
      // Optionnel : recharger les réservations pour corriger l’état
      fetchReservations(adminKey);
    } finally {
      setLoading(false);
    }
  };

  // ---------- DELETE ----------

  const deleteReservation = async (reservationId) => {
    if (!adminKey) return;
    const confirmDelete = window.confirm(
      'Supprimer définitivement cette réservation ?'
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reservations/${reservationId}`,
        {
          method: 'DELETE',
          headers: {
            'x-admin-key': adminKey,
          },
        }
      );

      if (response.ok) {
        setReservations((prev) =>
          prev.filter((res) => res.id !== reservationId)
        );
        toast.success('Réservation supprimée');
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('admin_key');
        toast.error('Clé admin expirée ou invalide');
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // ---------- EXPORT ----------

  const computeMontant = (reservation) => {
    if (reservation.status !== 'arrive') return 0;
    const n = parseInt(reservation.persons, 10);
    if (Number.isNaN(n) || n <= 0) return 0;
    return n * PRICE_PER_PERSON;
  };

  const getArrivedForExport = () =>
    filteredReservations.filter((r) => r.status === 'arrive');

  const handleExport = (format) => {
    setShowExportMenu(false);
    const arrived = getArrivedForExport();
    if (arrived.length === 0) {
      toast.info("Aucune réservation ARRIVÉE à exporter pour ce filtre");
      return;
    }

    if (format === 'csv') {
      exportCsv(arrived);
    } else if (format === 'pdf') {
      exportPdf(arrived);
    }
  };

  const exportCsv = (rowsSource) => {
    const headers = [
      'Date',
      'Heure',
      'Nom',
      'Téléphone',
      'Email',
      'Personnes',
      'Message',
      'Montant (DH)',
    ];

    const rows = rowsSource.map((r) => [
      r.date || '',
      r.time || '',
      r.name || '',
      r.phone || '',
      r.email || '',
      r.persons || '',
      r.message || '',
      computeMontant(r) || '',
    ]);

    const exportTotal = rowsSource.reduce(
      (sum, r) => sum + computeMontant(r),
      0
    );
    rows.push(['', '', '', '', '', '', 'Total', exportTotal || '']);

    const escapeCsvValue = (value) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(','))
      .join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reservations_dar_al_achab.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportPdf = (rowsSource) => {
    const win = window.open('', '_blank');
    if (!win) {
      toast.error("Impossible d'ouvrir la fenêtre d'export PDF");
      return;
    }

    const rowsHtml = rowsSource
      .map(
        (r) => `
        <tr>
          <td>${r.date || ''}</td>
          <td>${r.time || ''}</td>
          <td>${r.name || ''}</td>
          <td>${r.phone || ''}</td>
          <td>${r.email || ''}</td>
          <td>${r.persons || ''}</td>
          <td>${r.message || ''}</td>
          <td>${computeMontant(r) || ''}</td>
        </tr>`
      )
      .join('');

    const exportTotal = rowsSource.reduce(
      (sum, r) => sum + computeMontant(r),
      0
    );

    win.document.write(`
      <html>
        <head>
          <title>Réservations – Dar Al Achab</title>
          <style>
            body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; }
            h1 { text-align: center; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
            th { background: #f5f5f5; }
            tfoot td { font-weight: 600; }
          </style>
        </head>
        <body>
          <h1>Réservations – Dar Al Achab</h1>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Heure</th>
                <th>Nom</th>
                <th>Téléphone</th>
                <th>Email</th>
                <th>Personnes</th>
                <th>Message</th>
                <th>Montant (DH)</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="7" style="text-align:right;">Total :</td>
                <td>${exportTotal} DH</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print(); // "Enregistrer en PDF" via la boîte de dialogue d’impression
  };

  // ---------- FILTERING ----------

  const filteredReservations = reservations
    .filter((reservation) => {
      const reservationDate = reservation.date
        ? new Date(`${reservation.date}T00:00:00`)
        : null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      let dateMatch = true;
      if (reservationDate) {
        if (dateFilter === 'today') {
          dateMatch = reservationDate.getTime() === today.getTime();
        } else if (dateFilter === 'tomorrow') {
          dateMatch = reservationDate.getTime() === tomorrow.getTime();
        } else if (dateFilter === 'future') {
          dateMatch = reservationDate.getTime() >= today.getTime();
        }
      }

      const searchLower = searchTerm.toLowerCase();
      const nameMatch = reservation.name
        ?.toLowerCase()
        .includes(searchLower);
      const phoneMatch = reservation.phone
        ?.toLowerCase()
        .includes(searchLower);
      const emailMatch = reservation.email
        ?.toLowerCase()
        .includes(searchLower);

      return dateMatch && (nameMatch || phoneMatch || emailMatch);
    })
    .sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      return 0;
    });

  const totalArriveMontant = filteredReservations.reduce(
    (sum, r) => sum + computeMontant(r),
    0
  );

  // ---------- STATUS HELPERS ----------

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirme':
        return 'CONFIRMÉ';
      case 'arrive':
        return 'ARRIVÉ';
      default:
        return 'EN ATTENTE';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirme':
        return 'status-pill status-confirme';
      case 'arrive':
        return 'status-pill status-arrive';
      default:
        return 'status-pill status-en-attente';
    }
  };

  const getRowClass = (status) => {
    switch (status) {
      case 'confirme':
        return 'row-confirme';
      case 'arrive':
        return 'row-arrive';
      default:
        return '';
    }
  };

  const getAvailableActions = (status) => {
    const statuses = ['en_attente', 'confirme', 'arrive'];
    return statuses.filter((s) => s !== status);
  };

  const statusActionLabel = (status) => {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'confirme':
        return 'Confirmer';
      case 'arrive':
        return 'Arrivé';
      default:
        return status;
    }
  };

  // ---------- FORMATTING ----------

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(`${dateStr}T00:00:00`);
      return date.toLocaleDateString('fr-FR', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // ---------- LOGIN VIEW ----------

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <div className="admin-brand">
            <div className="admin-logo-wrapper">
              <img
                src="/images/logo-without-background.png"
                alt="Logo Dar Al Achab"
              />
            </div>
            <h2>Dar Al Achab</h2>
            <p>ADMINISTRATION</p>
          </div>
          <div className="admin-login-form">
            <Label htmlFor="admin-key">Clé Admin</Label>
            <Input
              id="admin-key"
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Entrez votre clé"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
            />
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="login-btn"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- DASHBOARD VIEW ----------

  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <div className="admin-header">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="logout-btn"
        >
          <LogOut size={16} />
          Déconnexion
        </Button>

        <div className="admin-header-inner">
          <h1>Réservations – Dar Al Achab</h1>
          <div className="admin-header-logo">
            <img
              src="/images/logo-without-background.png"
              alt="Logo Dar Al Achab"
            />
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="admin-controls">
        <div className="admin-search-row">
          <div className="admin-search">
            <Search size={20} />
            <Input
              placeholder="Rechercher par nom, téléphone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="admin-actions-right">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="refresh-btn"
            >
              <RefreshCw size={16} />
              Actualiser
            </Button>

            <div className="export-wrapper">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportMenu((prev) => !prev)}
                className="export-btn"
              >
                Exporter
                <ChevronDown size={14} />
              </Button>
              {showExportMenu && (
                <div className="export-menu">
                  <button
                    type="button"
                    onClick={() => handleExport('pdf')}
                  >
                    Exporter en PDF 
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport('csv')}
                  >
                    Exporter en CSV 
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="admin-filter-row">
          <span className="filter-label">Filtrer par date :</span>
          <div className="admin-filters">
            <Button
              variant={dateFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setDateFilter('all')}
              size="sm"
            >
              Toutes
            </Button>
            <Button
              variant={dateFilter === 'today' ? 'default' : 'outline'}
              onClick={() => setDateFilter('today')}
              size="sm"
            >
              Aujourd&apos;hui
            </Button>
            <Button
              variant={dateFilter === 'tomorrow' ? 'default' : 'outline'}
              onClick={() => setDateFilter('tomorrow')}
              size="sm"
            >
              Demain
            </Button>
            <Button
              variant={dateFilter === 'future' ? 'default' : 'outline'}
              onClick={() => setDateFilter('future')}
              size="sm"
            >
              Futures
            </Button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-label">TOTAL</div>
          <div className="stat-value">{reservations.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">AUJOURD&apos;HUI</div>
          <div className="stat-value">
            {
              reservations.filter((r) => {
                if (!r.date) return false;
                const rDate = new Date(`${r.date}T00:00:00`);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return rDate.getTime() === today.getTime();
              }).length
            }
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">FUTURES</div>
          <div className="stat-value">
            {
              reservations.filter((r) => {
                if (!r.date) return false;
                const rDate = new Date(`${r.date}T00:00:00`);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return rDate.getTime() >= today.getTime();
              }).length
            }
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">AFFICHÉES</div>
          <div className="stat-value">{filteredReservations.length}</div>
        </div>
      </div>

      {/* TABLE */}
      <div className="admin-table-container">
        {loading && filteredReservations.length === 0 ? (
          <div className="admin-loading">
            Chargement des réservations...
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="admin-empty">Aucune réservation trouvée</div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>
                    <span className="th-inner">
                      <Calendar size={16} />
                      <span>Date</span>
                    </span>
                  </th>
                  <th>
                    <span className="th-inner">Heure</span>
                  </th>
                  <th>
                    <span className="th-inner">
                      <User size={16} />
                      <span>Nom</span>
                    </span>
                  </th>
                  <th>
                    <span className="th-inner">
                      <Phone size={16} />
                      <span>Téléphone</span>
                    </span>
                  </th>
                  <th>
                    <span className="th-inner">
                      <Mail size={16} />
                      <span>Email</span>
                    </span>
                  </th>
                  <th>
                    <span className="th-inner">
                      <Users size={16} />
                      <span>Personnes</span>
                    </span>
                  </th>
                  <th>
                    <span className="th-inner">
                      <MessageSquare size={16} />
                      <span>Message</span>
                    </span>
                  </th>
                  <th>
                    <span className="th-inner">
                      <span>Statut</span>
                    </span>
                  </th>
                  <th>
                    <span className="th-inner">
                      <span>Montant</span>
                    </span>
                  </th>
                  <th>
                    <span className="th-inner">
                      <span>Actions</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => {
                  const montant = computeMontant(reservation);
                  return (
                    <tr
                      key={reservation.id}
                      className={getRowClass(reservation.status)}
                    >
                      <td className="date-cell">
                        {formatDate(reservation.date)}
                      </td>
                      <td className="time-cell">
                        {reservation.time || 'N/A'}
                      </td>
                      <td className="name-cell">
                        {reservation.name || 'N/A'}
                      </td>
                      <td className="phone-cell">
                        {reservation.phone ? (
                          <a href={`tel:${reservation.phone}`}>
                            {reservation.phone}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="email-cell">
                        {reservation.email ? (
                          <a href={`mailto:${reservation.email}`}>
                            {reservation.email}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="persons-cell">
                        <input
                          type="number"
                          min="0"
                          className="persons-input"
                          value={
                            reservation.persons === undefined ||
                            reservation.persons === null
                              ? ''
                              : reservation.persons
                          }
                          onChange={(e) =>
                            handlePersonsChange(
                              reservation.id,
                              e.target.value
                            )
                          }
                          onBlur={(e) =>
                            savePersonsEdit(
                              reservation.id,
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              savePersonsEdit(
                                reservation.id,
                                e.target.value
                              );
                            }
                          }}
                        />
                      </td>
                      <td className="message-cell">
                        {reservation.message ? (
                          <span title={reservation.message}>
                            {reservation.message.length > 50
                              ? `${reservation.message.substring(
                                  0,
                                  50
                                )}...`
                              : reservation.message}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <span
                          className={getStatusClass(reservation.status)}
                        >
                          {getStatusLabel(reservation.status)}
                        </span>
                      </td>
                      <td className="montant-cell">
                        {montant > 0 ? `${montant} DH` : '—'}
                      </td>
                      <td className="actions-cell">
                        <div className="actions-buttons">
                          {getAvailableActions(
                            reservation.status
                          ).map((actionStatus) => (
                            <Button
                              key={actionStatus}
                              size="xs"
                              variant="outline"
                              className={`action-btn action-${actionStatus}`}
                              onClick={() =>
                                updateStatus(
                                  reservation.id,
                                  actionStatus
                                )
                              }
                            >
                              {statusActionLabel(actionStatus)}
                            </Button>
                          ))}
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              deleteReservation(reservation.id)
                            }
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* TOTAL MONTANT (ARRIVÉ) */}
            <div className="table-total">
              <span className="table-total-label">Total :</span>
              <span className="table-total-value">
                {totalArriveMontant} DH
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Admin;
