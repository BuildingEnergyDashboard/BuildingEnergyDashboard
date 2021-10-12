describe('Test Orlando Building Data Json Query API and loacl function getJson:', () => {
  var url_Json_primary_use = 
  "https://data.cityoforlando.net/resource/f63n-kp6t.json?"+
  "$select=primary_us,count(primary_us)%20AS%20cnt&$group=primary_us&$order=cnt%20DESC";

test_Json_Query(url_Json_primary_use,0,'Commercial',38);
test_Json_Query(url_Json_primary_use,1,'Office',38);
test_Json_Query(url_Json_primary_use,2,'Apartment',38);
test_Json_Query(url_Json_primary_use,3,'Multifamily Housing',38);
});

describe('Test Orlando Building Data GeoJson API and loacl function getJson:', () => {
  var url_GeoJson = "https://data.cityoforlando.net/resource/f63n-kp6t.geojson";
  test_GeoJson(url_GeoJson,0,"1905 LEE RD",    909);
  test_GeoJson(url_GeoJson,1,"401 W AMELIA ST",909);
  test_GeoJson(url_GeoJson,2,"2900 MERCY DR  Building 8",909);
  test_GeoJson(url_GeoJson,3,"9040 DOWDEN RD",909);
  test_GeoJson(url_GeoJson,4,"1071 LAKE BALDWIN LN",909);
  test_GeoJson(url_GeoJson,5,"944 W LAKE MANN DR",909);
  });


describe('Test (string)getEnergyStarRangesize(int) take is energy star rating ruturns circle marker diameter:', () => {
  test_getEnergyStarRangesize(1,25,   '6')
  test_getEnergyStarRangesize(26,50,  '10')
  test_getEnergyStarRangesize(51,75,  '11')
  test_getEnergyStarRangesize(76,100, '12')
});

describe('Test (string)getEnergyStarRangesize(int) take is energy star rating ruturns color code:', () => {
  test_getMarkerColor(1,25,           "#fdae61") 
  test_getMarkerColor(26,50,          "#ffffbf") 
  test_getMarkerColor(51,75,          "#a6d96a") 
  test_getMarkerColor(76,100,         "#1a9641") 
  test_getMarkerColor(999,999,        "#d7191c") 
});

describe('Test (string)getEnergyStarRangesize(int) take is energy star rating ruturns esrCode:', () => {
  test_getEnergyStarRange(1,25,       "esr0_25") 
  test_getEnergyStarRange(26,50,      "esr26_50") 
  test_getEnergyStarRange(51,75,      "esr51_75") 
  test_getEnergyStarRange(76,100,     "esr76_100") 
});




function test_getEnergyStarRangesize(str,stp,expected) {
  it('getEnergyStarRangesize('+str+' -'+stp+') = "'+expected+'"', () => {
    for (let index = str; index <= stp; index++) {
      chai.expect(getEnergyStarRangesize(index)).to.eql(expected);
     } 
  })
};

function test_getMarkerColor(str,stp,expected) {
  it('getMarkerColor('+str+' -'+stp+') = "'+expected+'"', () => {
    for (let index = str; index <= stp; index++) {
      chai.expect(getMarkerColor(index)).to.eql(expected);
     } 
  })
};

function test_getEnergyStarRange(str,stp,expected) {
  it('getEnergyStarRangesize('+str+' -'+stp+') = "'+expected+'"', () => {
    for (let index = str; index <= stp; index++) {
      chai.expect(getEnergyStarRange(index)).to.eql(expected);
     } 
  })
};

function test_Json_Query(url,index,expected,lenth) {
it("Test Json query return "+lenth+" Values with "+expected+" @  index #"+index+"", async function() {
  var testPromise = new Promise(function(resolve, reject) {
      setTimeout(function() {
         var result = getJson(url);
          resolve(result);
      }, 200);
  });
  var result = await testPromise;
  //console.log(result.features);
   chai.expect(result.length).to.equal(lenth);
  chai.expect(result).to.satisfy((n) =>{
    //console.log(n); 
    return n[index].primary_us.includes(expected)
  });
});
}

function test_GeoJson(url,index,expected,lenth) {
  it("Test Json query return "+lenth+" Values with "+expected+" @  index #"+index+"", async function() {
    var testPromise = new Promise(function(resolve, reject) {
        setTimeout(function() {
           var result = getJson(url);
            resolve(result);
        }, 200);
    });
    var result = await testPromise;
    chai.expect(result.features.length).to.equal(909);
    chai.expect(result).to.satisfy((n) =>{
      //console.log(n.features[index]); 
      //console.log(n.features[index+1].properties.property_a); 
      return (n.features[index].properties.property_a == expected)
    });
  });
  }
