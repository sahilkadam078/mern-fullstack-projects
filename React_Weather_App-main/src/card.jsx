import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Input from './input.jsx'
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CloudySnowingIcon from '@mui/icons-material/CloudySnowing';


export default function ActionAreaCard({info}) {
  const sunny='https://static.vecteezy.com/system/resources/thumbnails/007/637/871/small/cute-summer-sunny-day-weather-character-smiling-with-clouds-in-yellow-background-illustration-vector.jpg';
  
  const winter='https://www.shutterstock.com/image-photo/winter-forest-south-park-sofia-600nw-2483073899.jpg'

  const rainy='https://t4.ftcdn.net/jpg/01/63/96/63/360_F_163966311_qh3qSk57mw9oLPOklZigzX9zlB5DgdaM.jpg'
  let weatherimage=sunny;
  let Icon=WbSunnyIcon;

  if(info.humidity>80){
    weatherimage=rainy;
    Icon=CloudySnowingIcon;
  }else if(info.temp<15){
    weatherimage=winter
    Icon=AcUnitIcon;
  }


  return (
    <Card style={{ maxWidth:'400px', marginLeft:'370px'}}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={weatherimage}
          alt="weather image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">{info.city}&nbsp;<Icon/></Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <p>Temperature : {info.temp}&deg;C</p>
            <p>Humidity : {info.humidity}%</p>
            <p>Min Temp : {info.tempMin}&deg;C</p>
            <p>Max Temp : {info.tempMax}&deg;C</p>
            <p>The Weather can be described as <i>{info.weather}</i> and feels like {info.feelsLike}</p>
            
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}