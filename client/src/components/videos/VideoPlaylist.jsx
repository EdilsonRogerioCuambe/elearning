import React from 'react'
import { MdPlayCircleOutline } from 'react-icons/md'
import { NavLink } from 'react-router-dom'

const VideoPlaylist = ({ dadosCurso }) => {
  return (
    <>
      {/* Playlist dos vídeos */}
      <div className="col-span-2">
        <h3 className="text-2xl font-semibold">playlist</h3>
        <div className=" h-96 overflow-y-auto scrollbar-thumb-purple-800 scrollbar-track-white scrollbar-thin border-2 border-gray-500 rounded-md p-4">
          {dadosCurso?.videos?.map((video, index) => (
            <NavLink
              to={`/curso/${dadosCurso?._id}/aula/${video?._id}`}
              key={index} className="flex items-center gap-4 my-4 border-b border-gray-500 pb-4">
              <div className="relative w-20 h-20 rounded-md">
                <MdPlayCircleOutline className="text-4xl text-green-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:text-green-600 transition-all duration-300 cursor-pointer" />
                <img src={video?.thumbnail} alt="" className="w-full h-full rounded-md object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{video?.titulo}</h3>
                <span className="text-gray-500">{video?.duracao}</span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  )
}

export default VideoPlaylist