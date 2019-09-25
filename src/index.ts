import Sdk from "elios-sdk";
import * as cheerio from 'cheerio';
import axios from 'axios'

var html = require('./index.html');
var credentials = require('../resources/credentials.json')

const $ = cheerio.load(html);

export default class News {

  sdk: Sdk;
  widget: any;

  constructor() {
    this.sdk = new Sdk();
  }

  stayOpen() {
    while (true) {
      
    }
  }

  showArticle(chosenOne: any) {
    $('.mxm_article_content').append(chosenOne.content);
    this.widget.html($('body').html());
  }

  wait(ms: number){
      var start = new Date().getTime();
      var end = start;
      while(end < start + ms) {
        end = new Date().getTime();
    }
  }

  async showList(response: any) {
    let tmplt: Cheerio;
  
    for (let index = 0; index < response.articles.length; index++) {
      const element = response.articles[index];
      tmplt = $('.minimalized-article');

      $(tmplt).find('.title').text(element.title);
      $(tmplt).find('.date').text(element.source.name + ' - ' + new Date(element.publishedAt).toDateString());
        
      this.widget.html($('body').html());          
      this.wait(50000)
    }
  }

  async getLatestNews() {
    let url = "https://newsapi.org/v2/top-headlines";

    await axios.get(url, {
      params: {
        'sources': 'the-new-york-times,google-news,the-wall-street-journal,cnn,bloomberg',
      },
      headers: {'X-Api-Key': credentials.NewsAPI.api_key}
    }).then((res) => {
      this.showList(res.data);
      // this.showArticle(res.data.articles[2]);
    })
  }

  async start() {
    this.widget = this.sdk.createWidget();
   
    await this.getLatestNews();

    setInterval(async () => {

      await this.getLatestNews();

    }, 18000000);

  }
}

new News().start();


