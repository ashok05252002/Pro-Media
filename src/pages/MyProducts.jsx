import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Filter, MoreHorizontal, ShoppingBag } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { extCompanyProductData, extCompanyProductDataSource, extCompanyProductAndDS } from '../API/api';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { green, red, grey } from '@mui/material/colors';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';

// Define colors (you can customize these)
const activeColor = green[500];   // #4CAF50
const inactiveColor = red[500];   // #F44336
const greyColor = grey[500]   //rgb(121, 120, 120)

const containerStyle = {
  position: 'absolute',
  right: '16px',
  top: '16px',
  backgroundColor: 'white',
  padding: '12px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  zIndex: 1000
};

// Style for each media item
  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

const SOCIAL_MEDIA = [
    { id: '7066', icon: FacebookIcon, name: 'Facebook' },
    { id: '7368', icon: InstagramIcon, name: 'Instagram' },
    { id: '8456', icon: YouTubeIcon, name: 'YouTube' },
    { id: '8984', icon: LinkedInIcon, name: 'LinkedIn' },
    { id: '8487', icon: TwitterIcon, name: 'Twitter' }
  ];
const ProductCard = ({ product, extDataSources }) => {


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700" >
        {product.image? (

          
          // <img 
          //   src={product.image} 
          //   alt={product.product_name} 
          //   className="w-full h-full object-cover"
          // />
          <div>

          </div>
        ) : (
          // <div className="w-full h-full flex justify-between right-2">
          <>
          <div >view Comments</div>
          <div style={containerStyle}>

            
            {/* <ShoppingBag className="w-12 h-12 text-gray-400" /> */}
             {/* <h4 style={{display:"none"}}>({product.data_sources?.length || 0})</h4>
             {product.data_sources?.map(data_source => {
                 */}

                {SOCIAL_MEDIA.map(media => {
                // Find if this media exists in data sources
                const source = product.data_sources?.find(
                  src => src.data_source_id.toString() === media.id
                );
                
                // Determine color based on status
                const color = 
                  !source ? grey[500] :         // No data source - grey
                  source.status === 'A' ? green[500] :  // Active - green
                  red[500];                    // Inactive - red

                return (
                  <div>
                    <div>
                     
                    </div>  

                  <div key={media.id} style={itemStyle}>

                    <media.icon fontSize="small" sx={{ color }} />
                     {source && ( <>
          <span style={{ 
            marginLeft: '8px',
            fontSize: '0.75rem',
            color: grey[600],
            fontWeight: 400
          }}>
            {source.counts_in_last_update_videos}
          </span>
          <span style={{ 
            marginLeft: '8px',
            fontSize: '0.75rem',
            color: grey[600],
            fontWeight: 400
          }}>
           {source.counts_in_last_update_comments}
          </span>
        </>
        )}
          
                    
                  </div>
                  </div>
                );
              })}



              {/* })}  */}
            </div>
          </>
            )}


                                          {/* {product.data_sources && product.data_sources.length > 0 ?
          (
          <ul> */}
            {/* {product.data_sources.map(source => (
              <li key={source.id}>
                {(() => {
                switch (source.data_source_id.toString()) {
                  case '7066': return <><FacebookIcon 
                                          fontSize="small" 
                                          sx={{
                                            color: source.status == 'A'?activeColor:inactiveColor
                                          }}
                                          /> </>;
                  case '8487': return <><TwitterIcon fontSize="small" 
                                                    sx={{
                                                        color: source.status == 'A'?activeColor:inactiveColor
                                                      }}    
                                      /> </>;
                  case '7668': return <><LinkedInIcon fontSize="small"
                                                      sx={{color: source.status == 'A'?activeColor:inactiveColor}}  
                                      /> </>;
                  case '8984': return <><YouTubeIcon fontSize="small"
                                                      sx={{color: source.status == 'A'?activeColor:inactiveColor}}                                      
                                      /> </>;
                  case '7378': return <><InstagramIcon fontSize="small"
                                                      sx={{color: source.status == 'A'?activeColor:inactiveColor}}                                      
                                      /> </>;
                  // Add more cases as needed
                  default: return <><FacebookIcon 
                                          fontSize="small" 
                                          sx={{
                                            color: greyColor
                                          }}
                                          />
                                          
                                      <TwitterIcon fontSize="small" 
                                                    sx={{
                                                        color: greyColor
                                                      }}    
                                      />
                                      <LinkedInIcon fontSize="small"
                                                      sx={{color: greyColor}}
                                      />
                                            
                                  </>        
                }
                })()}, {source.status === 'A' ? "Active" : "Inactive"}
                
              </li>
            ))} */}
          {/* </ul>
        ) : (
          <ul><li>
                <FacebookIcon fontSize="small" sx={{color: greyColor}}/>
              </li>   
              <li>
                <TwitterIcon fontSize="small" sx={{color: greyColor}} />
              </li>
              <li>
                <LinkedInIcon fontSize="small" sx={{color: greyColor}}/>
              </li>
              <li>
                <YouTubeIcon fontSize="small" sx={{color: greyColor}}/>
              </li>
              <li>
                <InstagramIcon fontSize="small" sx={{color: greyColor}}/>
              </li>


            </ul>    
        
        )
        } */}

            {/* <p>{extDataSources}</p>
            <h3>Today updated comments: {extDataSources}</h3> */}
          {/* </div>
        )} */}
        {/* <div className="absolute top-2 right-2">
          <button className="p-1 rounded-full bg-white dark:bg-gray-800 shadow">
            <MoreHorizontal className="w-5 h-5 text-black-500" />
          </button>
        </div> */}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-theme-primary">{product.product_name}</h3>
          <ul>
            <li><span>{product.product_status}</span></li>
            <li><span>{product.created_on}</span></li>
          </ul>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{product.description}</p>
        
        {/* <div className="flex justify-between items-center">
          <span className="font-bold text-theme-primary">${product.price}</span> */}
          {/* <div className="text-sm text-gray-500 dark:text-gray-400">
            SKU: {product.sku}
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};


const MyProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [extSources, setExtSources] = useState([]);
  const navigate = useNavigate();
  

  const handleAddProduct = () =>{
    navigate("/regproduct")
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const authTokens = localStorage.getItem("authToken")
        // extCompanyProductData().then(response => {
        //   console.log(response.data)
        //   if (response.data){
        //     setProducts(response.data);
        //     setLoading(false);
        //     // setError("there is no Product register")


        //     // 2. Fetch external sources sequentially
        //     const sourcesByProduct = {};
        //     const sourcesByProductData = {};
        //     let count = 0
        //     for (const product of products) {
        //       console.log("SourcesByProduct" + product.id)
        //       extCompanyProductData().then(response2 => {
        //         console.log(response2.data)
        //         if (response2.data){
                
        //         }
        //         else{
        //           setError("There is ERROR")
        //         }
        //       })
        //       .catch(err2 => {
        //         console.log(err2)    
        //       });
                  
        //     }    
            
        //   }
        //   else{
        //     setError("There is no Register Product ")
        //   }  


          

        // })
        // .catch(err => {
        //   console.log(err)    
        // });
        extCompanyProductAndDS().then(response => {
          console.log(response.data)
          if (response.data){
            setProducts(response.data);
            setLoading(false);
  
         }
        })
        .catch(err => {
          console.log(err);
          setLoading(false);  
        });
        
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();

    // const response = extCompanyProductDataSource(product.id);
    //           // console.log("debugging Array: ", sourcesByProduct[product.id])
    //           const tempPrdctDS = response?.data || [];
    //           console.log(response.data)
              
          
    //           // 3. Filter out any null/undefined entries
    //           const filteredData = Array.isArray(tempPrdctDS) 
    //                               ? tempPrdctDS.filter(item => item != null) : [];
          
    //           // 4. Store in both objects if needed
    //           //sourcesByProduct[product.id] = response;  // Store full response if needed
    //           sourcesByProduct[count] = filteredData;
    //           count = count + 1
    //         }
    //         console.log("debugging array", sourcesByProduct);
            
    //         setExtSources(sourcesByProduct)

    //fetchandjoindata
    // const fetchAndJoinData = async () => {
    //   try {
    //     setLoading(true);
        
    //     // Fetch data from both tables
    //     const [productsResponse, dataSourcesResponse] = await Promise.all([
    //       extCompanyProductData(), // Replace with your actual API endpoint
    //       extCompanyProductDataSource() // Replace with your actual API endpoint
    //     ]);

    //     if (!productsResponse.ok || !dataSourcesResponse.ok) {
    //       throw new Error('Failed to fetch data');
    //     }

    //     const productsData = await productsResponse.json();
    //     const dataSourcesData = await dataSourcesResponse.json();

    //     // Join the tables where ext_product.id === ext_product_data_source.product_id
    //     const joinedData = productsData.map(product => {
    //       const matchingDataSource = dataSourcesData.find(
    //         dataSource => dataSource.product_id === product.id
    //       );
          
    //       return {
    //         ...product,
    //         ...matchingDataSource // This merges the matching data source properties
    //       };
    //     }).filter(item => item.product_id !== undefined); // Filter to only include joined records

    //     setProducts(joinedData);
    //     setLoading(false);
    //   } catch (err) {
    //     setError(err.message);
    //     setLoading(false);
    //   }
    // };

    // fetchAndJoinData();


  }, []);

  const filteredProducts = products?.filter(product => {
  const searchTerm = searchQuery.toLowerCase();
  const productName = product.product_name?.toLowerCase() || '';
 
  return productName.includes(searchTerm);
});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Error loading products: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">My Products</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-theme-primary hover:bg-opacity-90 text-white rounded-md" onClick={handleAddProduct}>
            <Plus className="w-4 h-4" />
            {products.length !== 0?(
              <span>Add Business</span>): (<span>Register Your Business</span> )
            }
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
       
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
         */}
        
        {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              extDataSources={product.data_sources}
              

            />
          ))}
      </div>
      {products.length !==0? (
      <div>
      {filteredProducts.length === 0 &&  (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
      </div>
      ): <p> There is no product.</p>
    }
    </div>
    
  );
};

export default MyProducts;