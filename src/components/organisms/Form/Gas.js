import React from 'react';
import {useState, useEffect} from 'react';
import "./_Form.scss";
import "./_Table.scss";
import {Link, useParams} from "react-router-dom";

const getData = (key) => {
    const data = window.localStorage.getItem(key);
    if (data) {
        return JSON.parse(data);
    } else {
        return []
    }
}


const NewItem = () => {
    const {corporation} = useParams()
    let counter;
    let fee;

    switch (corporation) {
        case 'EWE':
            counter = 0.23;
            fee = 6.27;
            break;
        case 'Fortum':
            counter = 0.20;
            fee = 7.30;
            break;
        case 'PGNiG':
            counter = 0.20;
            fee = 6.30;
            break;
        case 'PGE':
            counter = 0.24;
            fee = 6.58;
            break;
        case 'Tauron':
            counter = 0.20;
            fee = 6.30;
            break;
        default:
            console.log(`nothing ${corporation}.`);
    }

    const [total,setTotal]= useState(getData("total"));
    const [score,setScore] =useState(0);
    const [equipments, setEquipments] = useState(getData("equipments"));
    const [device, setDevice] = useState('Kocioł gazowy');
    const [power, setPower] = useState('');
    const [hours, setHours] = useState('');
    const [days, setDays] = useState('');
    const [reference,setReference] = useState(getData("reference")?getData("reference"):[]);

    const handleAddSubmit = (e) => {
        e.preventDefault();


        setEquipments({device, power, hours, days})
        setScore((Number(power) * Number(days)* Number(hours) * counter)+fee);
        setTotal(Number(total) + Number(score));

        setReference(tab =>[...tab,{
            device,
            power,
            hours,
            days,
            score,
        }])
    }


    useEffect( () =>{
            setScore((Number(power) * Number(days)* Number(hours) * counter)+fee);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [power,
              days,
              hours,

        ]
    )
    useEffect(() => {
        localStorage.setItem('equipments', JSON.stringify(equipments));
    }, [equipments])
    console.log({device, power, hours, days,score});

    useEffect(() => {
        localStorage.setItem('info', JSON.stringify(reference));
    }, [reference])

    useEffect(() => {
        localStorage.setItem('total', JSON.stringify(total));
    }, [total])
    console.log({device, power, hours, days,score,total});


    return (
        <div className='wraper'>
            <h1>Przelicznik gazu</h1>
            <div className='form-container'>
                <form autoComplete="off" className='form-group'
                      onSubmit={handleAddSubmit}
                      >
                    <label>Urządzenie</label>
                    <div className="custom-select">
                        <select className="selectInput" value={device} onChange={e => setDevice(e.target.value)}>
                            <option value="Kocioł gazowy">Kocioł gazowy</option>
                            <option value="Kuchenka gazowa">Kuchenka gazowa</option>
                        </select>
                    </div>
                    <br/>
                    <label>Moc[kWh]</label>
                    <input type="text" className='form-control' required
                           onChange={(e) => setPower(e.target.value)} value={power}/>
                    <br/>
                    <label>Ilość godzin/dzień</label>
                    <input type="text" className='form-control' required
                           onChange={(e) => setHours(e.target.value)} value={hours}/>
                    <br/>
                    <label>Ilość dni/miesiąc</label>
                    <input type="text" className='form-control' required
                           onChange={(e) => setDays(e.target.value)} value={days}/>
                    <br/>
                    <button type="submit" className='btn btn-success btn-md'>
                        Dodaj
                    </button>
                </form>
                <button type ="reset" onClick={() => {
                    setTotal("")
                    localStorage.removeItem("total")
                    reference.length=0
                    localStorage.removeItem("reference")
                }} className='btn btn-success btn-md'>
                    Usuń dane
                </button>
                <Link to={"/Contact/"} onClick={() => {
                }} >
                    <button type ="button" className='btn btn-success btn-md'>
                        Prześlij dane
                    </button>
                </Link>
            </div>

            <div className='view-container'>
                <div className='table-responsive'>
                    <table className='table'>
                        <thead>
                        <tr>
                            <th>Urządzenie</th>
                            <th>Moc</th>
                            <th>Godziny</th>
                            <th>Dni</th>
                            <th>Zużycie[zł]</th>
                        </tr>
                        </thead>
                        <tbody>

                        {reference.map(equipment => (
                            <tr key={equipment.device}>
                                <td>{equipment.device}</td>
                                <td>{equipment.power}</td>
                                <td>{equipment.hours}</td>
                                <td>{equipment.days}</td>
                                <td>{equipment.score}</td>
                            </tr>))}
                        <th>Ogólne zużycie[zł]</th>
                        </tbody>
                        <tr>
                            <td>{total}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default NewItem;