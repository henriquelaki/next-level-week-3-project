import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';

import { LeafletMouseEvent } from 'leaflet'
import { FiPlus } from "react-icons/fi";

import mapIcon from '../utils/mapIcon'

import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { useHistory } from "react-router-dom";


export default function CreateOrphanage() {

  const history = useHistory();

  const [ position, setPosition ] = useState({
    latitude: 0,
    longitude: 0
  })

  const [ name, setName ] = useState('')
  const [ about, setAbout ] = useState('')
  const [ instructions, setInstructions ] = useState('')
  const [ opening_hours, setOpeningHours ] = useState('')
  const [ open_on_weekends, setOpenOnWeekends ] = useState(true)
  const [ whatsapp_number, setWhatsappNumber ] = useState('')
  const [ images, setImages] = useState<File[]>([])
  const [ previewImages, setPreviewImages ] = useState<string[]>([])
  const [ initialLatitude, setInitialLatitude ] = useState(-23.4850768)
  const [ initialLongitude, setInitialLongitude] = useState(-46.6855935)
  


  function getBrowserGeoLocation() {
    navigator.geolocation.getCurrentPosition(function(position){
        setInitialLatitude(position.coords.latitude)
        setInitialLongitude(position.coords.longitude)
    })
  }
  getBrowserGeoLocation()
  function handleMapClick(e: LeafletMouseEvent) {

    const { lat, lng } = e.latlng
    setPosition({
      latitude: lat,
      longitude: lng,
    });
  }


  function handleSelectImages(e: ChangeEvent<HTMLInputElement>) {

    if (!e.target.files) {
      return
    } else {
      const selectedImages = Array.from(e.target.files)
      setImages(selectedImages)

      const selectedImagesPreview = selectedImages.map(image => {
        return URL.createObjectURL(image)
      })

      setPreviewImages(selectedImagesPreview)
    }

  }

  async function handleSubmit(e: FormEvent) {
      e.preventDefault()
      const { latitude, longitude } = position

      const data = new FormData();

      data.append('name', name)
      data.append('about', about)
      data.append('latitude', String(latitude))
      data.append('longitude', String(longitude))
      data.append('instructions', instructions)
      data.append('opening_hours', opening_hours)
      data.append('open_on_weekends', String(open_on_weekends))
      data.append('whatsapp_number', whatsapp_number)

      images.forEach( image => {
         data.append('images', image)
      })

      await api.post('orphanages', data)

      alert('Cadastro realizado com sucesso')

      history.push('/app')

  }
  console.log(initialLatitude, initialLongitude)
  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[initialLatitude,initialLongitude]}
              style={{ width: '100%', height: 280 }}
              zoom={11}
              onClick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              { position.latitude !== 0 && (
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[
                    position.latitude,
                    position.longitude
                  ]} />
              )}

            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea
                id="name"
                maxLength={300}
                value={about}
                onChange={e => setAbout(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map( preview => {
                  return(
                    <img key={preview} src={preview} alt={name}/>
                  )
                })}
                <label
                  htmlFor="image[]"
                  className="new-image"
                >
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input
                multiple
                type="file"
                id="image[]"
                onChange={handleSelectImages}
              />

            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" value={instructions} onChange={e => setInstructions(e.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de atendimento</label>
              <input id="opening_hours" value={opening_hours} onChange={e => setOpeningHours(e.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="whatsapp_number">Whatsapp</label>
              <input type="tel" minLength={10} maxLength={11} id="whatsapp_number" value={whatsapp_number} onChange={e => setWhatsappNumber(e.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={open_on_weekends ? 'active' : ''}
                  onClick={e => setOpenOnWeekends(true)}
                >
                  Sim
                </button>

                <button
                  type="button"
                  className={open_on_weekends ? '' : 'active'}
                  onClick={e => setOpenOnWeekends(false)}
                  >
                    Não
                  </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
