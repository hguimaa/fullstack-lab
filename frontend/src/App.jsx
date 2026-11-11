import { useEffect, useState } from 'react'
import { listEvents, register } from './api.js'

function slotsText(slots) {
  return slots === 1 ? '1 vaga disponível' : `${slots} vagas disponíveis`
}

export default function App() {
  const [userId, setUserId] = useState(1)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [sendingId, setSendingId] = useState(null)

  useEffect(() => {
    listEvents()
      .then(setEvents)
      .catch(() => setError('Não foi possível carregar os eventos.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleRegister(eventId) {
    setSendingId(eventId)
    setError('')
    setSuccess('')
    try {
      await register(eventId, userId)
      setEvents(await listEvents())
      setSuccess('Inscrição realizada!')
    } catch (err) {
      setError(err.message)
    } finally {
      setSendingId(null)
    }
  }

  return <main className="page">
    <header>
      <p className="eyebrow">Trilha · Laboratório Full Stack</p>
      <h1>Eventos</h1>
      <p>Encontre uma atividade e garanta sua vaga.</p>
    </header>

    <label className="user-picker">Participante de demonstração
      <select value={userId} onChange={event => setUserId(Number(event.target.value))}>
        <option value="1">Pessoa 1</option>
        <option value="2">Pessoa 2</option>
      </select>
    </label>

    {loading && <p>Carregando eventos...</p>}
    {error && <p role="alert">{error}</p>}
    {success && <p role="status">{success}</p>}
    {!loading && !error && events.length === 0 && <p>Nenhum evento cadastrado.</p>}

    <section aria-label="Lista de eventos" className="events">
      {events.map(event => (
        <article className="card" key={event.id}>
          <p className="date">{event.date}</p>
          <h2>{event.title}</h2>
          <p>{slotsText(event.available_slots)}</p>
          <button
            type="button"
            disabled={sendingId === event.id || event.available_slots === 0}
            onClick={() => handleRegister(event.id)}
          >
            Inscrever-se
          </button>
        </article>
      ))}
    </section>
  </main>
}
