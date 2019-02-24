import $ from 'jquery'

const commonAjaxConfig = {

}

export function networkError(...args) {
  console.error(args)
}

export default class Safely {
  getChildLocation(){
    return $.ajax(Object.assign({}, commonAjaxConfig, {
      url: "https://1e1b49c2.ngrok.io/child_location",
      type: 'GET'
    }))
  }

  updateChildLocation(data){
    return $.ajax(Object.assign({}, commonAjaxConfig, {
      url: "https://1e1b49c2.ngrok.io/child_location",
      type: 'POST',
      data: JSON.stringify(data),
      contentType: false,
      processData: false
    }))
  }
}