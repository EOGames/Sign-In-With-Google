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



const Database = () => {
  const [database, setDatabase] = useState({
    database_data: [],
    count: 0,
  });
  // const [maxDataCount,setMaxDataCount] = useState(0);
  const [serchValue, setSearchValue] = useState('');

  let [activePage, setActivePage] = useState(0);

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
      let data = await GetDatabase(activePage, 10, serchValue,activeKey);

      
      console.log(`%cStatus Code', ${data.status} `, 'color:red');
      if (data.status === 200)
      {

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
      else
      {
        alert ('Your Login Session Expired Please Relog To Continue');
        localStorage.removeItem('log_session');
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


  // const GoogleResponse = async (response) => {
  //   let data = await response;
  //   console.log('google Response ', data);

  // }

  const CreateRowData = (id, model, brand, price, _id) => {
    return { id, model, brand, price, _id };
  }

  return (

    <>
      {console.log('databaseForRendering', database)}
      
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