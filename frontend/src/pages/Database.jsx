import * as React from 'react';
// import { DataGrid } from '@mui/x-data-grid';

import { GetDatabase } from '../api/database.api';
import { useEffect, useState } from 'react';

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@material-ui/core/TablePagination";

import { SendMail } from "../api/sendMail.api";
import { useRef } from 'react';
import { ChqIfAlreadyAsked } from '../api/alreadyHavePermission.api';
import{genrateRefreshToken} from '../api/genrateRefreshToken.api';


const Database = ({ client_id, email }) => {
  //  const scopes = 'https://mail.google.com/	'
  const google = window.google;

  const [database, setDatabase] = useState({
    database_data: [],
    count: 0,
  });

  const [acessCode, setAcessCode] = useState('');
  // const [maxDataCount,setMaxDataCount] = useState(0);
  const [serchValue, setSearchValue] = useState('');

  let [activePage, setActivePage] = useState(0);

  const receiversEmail = useRef('');
  const subject = useRef('');
  const msgToSend = useRef('');

  const [msgInterfaceStatus, setMsgInterfaceStatus] = useState(false);

  const handleChangePage = (event, newPage) => {
    console.log(`Event:${event} newPage:${newPage}`);

    setActivePage(newPage);
  }

  const handleSearch = (value) => {
    console.log(`%c Search Value is ${value}`, ' color:red');
    setSearchValue(value);
  }

  const GetData = async () => {

    const activeKey = localStorage.getItem('log_session');

    try {

      console.log('Active Page is ', activePage, " search Value is ", serchValue);
      let data = await GetDatabase(activePage, 10, serchValue, activeKey);


      console.log(`%cStatus Code', ${data.status} `, 'color:red');
      if (data.status === 200) {

        console.log(' Fetched DataBase:', data);

        let count = data.data.count;
        //  setMaxDataCount(data.data.count)
        data = data.data.data;

        let dataArray = [];

        for (let i = 0; i < data.length; i++) {
          let d = data[i];
          dataArray.push(CreateRowData(i, d.model, d.brand, d.price, d._id));
        }
        setDatabase({ dataArray, count });
      }
      else {
        alert('Your Login Session Expired Please Relog To Continue');
        localStorage.removeItem('log_session');
        // localStorage.removeItem('AskedPermision');

        window.location.reload();
      }
    }
    catch (error) {
      console.log('Got Error While Fetching Data:::', error);
    }

  }

  useEffect(() => {
    GetData();
  }, [activePage, serchValue]);



  const CreateRowData = (id, model, brand, price, _id) => {
    return { id, model, brand, price, _id };
  }

  const acessCodeResponseHandler = async (response) => {
    console.log('<<>>>>><<::::::::::::::::', response.code);
    setAcessCode(response.code);
    setMsgInterfaceStatus(true);
    await genrateRefreshToken(email,response.code);
  }

  const client = google?.accounts?.oauth2.initCodeClient({
    client_id: client_id,
    scope: 'https://mail.google.com/	',
    ux_mode: 'popup',
    callback: acessCodeResponseHandler,
  });


  const handleAcessCode = () => {
    client.requestCode();
  }

  useEffect(() => {
    CheckingIfUserAlreadyGavePermissions();

  }, [])

  const CheckingIfUserAlreadyGavePermissions = async () => 
  {
    // if (!localStorage.getItem('AskedPermision')) 
    // {

      let user = await ChqIfAlreadyAsked(email);
      console.log('User Found ::::', user);

      if (user.refreshToken === '') 
      {
        setTimeout(() => 
        {
          handleAcessCode();

        }, 1000);
      }
       else 
      {
        // setAcessCode(response.code); 
        setMsgInterfaceStatus(true);
      }     
    // }
    //  else 
    // {
    //   // setAcessCode(response.code); 
    //   setMsgInterfaceStatus(true);
    // }
  }

  const CreateDraft = async () => {
    console.log('Called::::::::::::::::::: Acess Code ', acessCode);

    console.log('<>_Started');
    HandleEmailStatus(true);
    let data = await SendMail(acessCode, email, receiversEmail.current.value, msgToSend.current.value, subject.current.value);
    // receiversEmail.current.value = '';
    subject.current.value = '';
    msgToSend.current.value = '';
    // setMsgInterfaceStatus(false);
    console.log('<>_Stoped');
    HandleEmailStatus(false);

    console.log('after mail Sent', data);
  }

  const HandleEmailStatus = (bool) => {
    const email_status = document.getElementById('email_status');
    if (bool) {
      email_status.style = 'color:yellow';
      email_status.innerHTML = 'Sending....';
    }
    else {
      email_status.style = 'color:skyblue';
      email_status.innerHTML = 'Msg Sent !';

      setTimeout(() => {
        email_status.innerHTML = '';
      }, 1500);
    }

  }

  return (

    <>
      {console.log('databaseForRendering', database)}
      {/* <button onClick={handleAcessCode}>Auth</button> */}

      {
        msgInterfaceStatus ? <div className='msgFourm'>
          <input ref={receiversEmail} type="text" placeholder='Enter Receivers Email Id' />
          <input ref={subject} type="text" placeholder=' Enter subject' />
          <input ref={msgToSend} type="text" placeholder='Message To Send' />
          <button onClick={CreateDraft}>Send Message</button>
          <p id='email_status'></p>
        </div>
          : null
      }


      <div className='tableHolder'>

        <Table className='database_Table' >
          <TableHead>
            <TableRow className='bgColorSkyBlue' style={{ borderRadius: '20px' }}>
              <TableCell colSpan={4} style={{ border: 'none' }} >
                <input type="serch" className="serchBox" placeholder=" Serch Model Brand Or Price" onChange={(e) => handleSearch(e.target.value)} />
              </TableCell>

            </TableRow>
            <TableRow >
              {/* <TableCell className='bgColorSkyBlue' style={{borderTopLeftRadius:'20px'}} >Id</TableCell> */}
              <TableCell className='bgColorSkyBlue' >Model</TableCell>
              <TableCell className='bgColorSkyBlue'>Brand</TableCell>
              <TableCell className='bgColorSkyBlue'>Price</TableCell>
              <TableCell className='bgColorSkyBlue' >DataBaseId</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {
              database?.dataArray?.length > 0
                ?
                database?.dataArray?.map((d, index) =>

                  <TableRow hover key={'row_' + index} className={index % 2 === 0 ? 'evenRow' : 'oddRow'}>
                    {/* <TableCell >{index}</TableCell> */}
                    <TableCell >{d.model}</TableCell>
                    <TableCell>{d.brand}</TableCell>
                    <TableCell>{d.price}</TableCell>
                    <TableCell>{d._id}</TableCell>
                  </TableRow>
                )
                :
                <TableRow style={{ backgroundColor: 'white' }}>
                  <TableCell colSpan={4}> No Data Found ! </TableCell>
                </TableRow>
            }


          </TableBody>
        </Table>
        <TablePagination style={{ display: 'inline-flex' }}
          rowsPerPageOptions={[10]}
          component="div"
          count={database.count} // This is what your request should be returning in addition to the current page of rows.
          rowsPerPage={10}
          page={activePage}
          size='large'
          onPageChange={handleChangePage}
        //   onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>


    </>

  );
}
export default Database;