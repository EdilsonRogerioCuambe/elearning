import React from 'react';
import Layout from '../../layout/Layout';
import load from '../../assets/images/loading.json';
import Lottie from "lottie-react";

const Loading = ({ legenda }) => {
  return (
    <Layout>
      <div className="flex justify-center items-center font-mono align-middle h-screen">
        <Lottie
          animationData={load}
          style={{ width: 50, height: 50 }}
        />
        <h2 className="text-green-500 text-lg animate-pulse">
          {legenda}
        </h2>
      </div>
    </Layout>
  )
}

export default Loading;
