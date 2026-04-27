import { useState } from 'react'
import './App.css'
import Input from './input';
import '@fontsource/roboto/500.css'; 
import ActionAreaCard from './card';

function App() {
  const [weatherdata,setweatherdata]=useState({
    city:'Delhi',
    temp:25,
    tempMin:20,
    tempMax:30,
    humidity:47,
    feelsLike:24,
    weather:"haze"
  });

  let updateinfo=(newinfo)=>{
    setweatherdata(newinfo);
  }

  return (
    <div className="App">
      <h1 style={{color:"white", fontFamily:'Georgia',paddingTop:'10px',paddingBottom:'5px'}}>Weather React App</h1>
      <Input updateinfo={updateinfo}/>
      <ActionAreaCard info={weatherdata}/>
    </div>
  );
}

export default App;
