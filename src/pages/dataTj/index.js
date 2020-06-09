import {withRouter} from "react-router-dom";
import React, {Component} from 'react'
import "./index.less";
import $ from "jquery";
import BarReactEcharts from "echarts-for-react";
import PieReactEcharts from "echarts-for-react";
import { DatePicker, List } from 'antd-mobile';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import Super from "../../super";
import * as moment from "moment";
import Text from "antd-mobile/es/text";

class DataTj extends Component{
    state={menuId:17,pageSize:100,
        barLegendData:[],alignWithLabel:false,X轴字号:"",xAxisData:[],series:[],barSearchFlag:"",barQueryKey:"",pieQueryKey:"",barStartDate:"",barEndDate:"", barReload:false,
        barSeriesNameList:[],barSeriesDataList:[],barSeriesColorList:[],bjqySelectList:[],pieLegendData:[],pieSeriesDataList:[],pieSearchFlag:"",pieReload:false,
        zhBarLegendData:[],zhAlignWithLabel:false,综合X轴字号:"",zhxAxisData:[],zhSeries:[],zhBarSearchFlag:"",zhBarQueryKey:"",zhPieQueryKey:"",zhBarStartDate:"",zhBarEndDate:"", zhBarReload:false,
        zhBarSeriesNameList:[],zhBarSeriesDataList:[],zhBarSeriesColorList:[],zhBjqySelectList:[],zhPieLegendData:[],zhPieSeriesDataList:[],zhPieSearchFlag:"",zhPieReload:false,
        bjtjColumnsId:{},//报警统计字段id
        bjtjColumnsFieldId:{},//报警统计字段fieldId
        区域职能1字段:"区域职能1",
        区域职能2字段:"区域职能2",
        所属部门字段:"所属部门",
        报警围栏字段:"报警围栏",
        名称字段:"名称",
        日期字段:"日期",
        月度周字段:"月度周",
        日字段:"日",
        月字段:"月",
        报警类型字段:"报警类型",
        年字段:"年",
        数量字段:"数量",
        电子围栏字段:"电子围栏",
        总数量字段:"总数量",
        // 报警围栏:96488543625218,
        // 日期:96488543625219,
        // 月度周:96488543625222,
        // 日:96488543625223,
        // 月:96488543625221,
        // 报警类型:96488543625224,
        // 年:96488543625220,
        // 数量:96488543625225,
        日查询常量:"date",周查询常量:"week",月查询常量:"month",三个月查询常量:"three_month",
        报警类型数据库里名称:{紧急报警:"人员一键紧急报警",缺员报警:"车间缺员报警",超员报警:"车间超员报警",串岗报警:"人员串岗报警",滞留报警:"人员滞留报警",静止报警:"人员长时间静止报警"},
        报警类型手机端显示名称:{紧急报警:"一键紧急报警",缺员超员报警:"车间缺员、超员报警",串岗滞留报警:"人员串岗、滞留报警",静止报警:"静止报警"},
        todayBjCountList:[],bjqyList:[]}

    componentDidMount() {
        $("html").css("background-color","#F5F5F5");
        this.request();
    }
    request=()=>{
        this.initBjtjColumnsId();
    }
    initBjtjColumnsId=()=>{
        Super.super({
            url:`api2/entity/${this.state.menuId}/list/tmpl`,
            method:'GET',
        }).then((res) => {
            let bjtjColumnsId = {};
            let bjtjColumnsFieldId = {};
            let resColumns=res.ltmpl.columns;
            resColumns.map((item, index) => {
                console.log(item.title+",==="+item.id)
                bjtjColumnsId[item.title] = item.id;
                bjtjColumnsFieldId[item.title] = item.fieldId;
            });
            //console.log(bjtjColumnsId)
            this.setState({bjtjColumnsId: bjtjColumnsId});
            this.setState({bjtjColumnsFieldId: bjtjColumnsFieldId});

            this.initBarListByMenuId(this.state.日查询常量,false);
            this.initPieListByMenuId(this.state.日查询常量,false);

            this.initZHBarListByMenuId(this.state.日查询常量,false);
            this.initZHPieListByMenuId(this.state.日查询常量,false);
        });
    }
    initBarListByMenuId=(flag,reload)=>{
        this.state.barSearchFlag=flag;
        this.state.barReload=reload;
        let disabledColIds="";
        $("#bar_search_type_div #but_div div").css("color","#000");
        $("#bar_search_type_div #but_div div").css("border-bottom","#fff solid 1px");
        if(this.state.barSearchFlag==this.state.日查询常量){
            $("#bar_search_type_div #date_but_div").css("color","#477A8F");
            $("#bar_search_type_div #date_but_div").css("border-bottom","#497DD0 solid 1px");

            disabledColIds="";
            this.state.X轴字号=10;
            this.state.alignWithLabel=true;
        }
        else if(this.state.barSearchFlag==this.state.周查询常量){
            $("#bar_search_type_div #week_but_div").css("color","#477A8F");
            $("#bar_search_type_div #week_but_div").css("border-bottom","#497DD0 solid 1px");

            disabledColIds=this.state.bjtjColumnsId[this.state.日字段];//这里是第一次加载完之后的数据
            this.state.X轴字号=9;
            this.state.alignWithLabel=false;
        }
        else if(this.state.barSearchFlag==this.state.月查询常量){
            $("#bar_search_type_div #month_but_div").css("color","#477A8F");
            $("#bar_search_type_div #month_but_div").css("border-bottom","#497DD0 solid 1px");

            disabledColIds=this.state.bjtjColumnsId[this.state.日字段]+","+this.state.bjtjColumnsId[this.state.月度周字段];
            this.state.X轴字号=9;
            this.state.alignWithLabel=true;
        }
        Super.super({
            url:`api2/entity/${this.state.menuId}/list/tmpl`,
            method:'GET',
            query:{disabledColIds:disabledColIds,sortColIds:(this.state.bjtjColumnsId[this.state.日期字段]+"_ASC"),criteria_13:this.state.barStartDate+"~"+this.state.barEndDate}
        }).then((res) => {
            console.log(res);
            console.log("柱状图数据==="+JSON.stringify(res));
            this.state.barQueryKey=res.queryKey;
            if(!this.state.barReload){//这里是初始化报警类型，只有在首次加载页面的时候初始化一次就行
                res.ltmpl.criterias.map((item,index)=>{
                    if(item.id==6){
                        this.initBarlegendData(item.fieldId);
                    }
                });
            }
            else
                this.initBarListByQueryKey();
        })
    }
    initZHBarListByMenuId=(flag,reload)=>{
        this.state.zhBarSearchFlag=flag;
        this.state.zhBarReload=reload;
        let disabledColIds="";
        $("#zhBar_search_type_div #but_div div").css("color","#000");
        $("#zhBar_search_type_div #but_div div").css("border-bottom","#fff solid 1px");
        if(this.state.zhBarSearchFlag==this.state.日查询常量){
            $("#zhBar_search_type_div #date_but_div").css("color","#477A8F");
            $("#zhBar_search_type_div #date_but_div").css("border-bottom","#497DD0 solid 1px");

            disabledColIds=this.state.bjtjColumnsId[this.state.区域职能1字段]+","+this.state.bjtjColumnsId[this.state.所属部门字段]+","+this.state.bjtjColumnsId[this.state.报警围栏字段];
            this.state.综合X轴字号=10;
            this.state.zhAlignWithLabel=true;
        }
        else if(this.state.zhBarSearchFlag==this.state.周查询常量){
            $("#zhBar_search_type_div #week_but_div").css("color","#477A8F");
            $("#zhBar_search_type_div #week_but_div").css("border-bottom","#497DD0 solid 1px");

            disabledColIds=this.state.bjtjColumnsId[this.state.区域职能1字段]+","+this.state.bjtjColumnsId[this.state.所属部门字段]+","+this.state.bjtjColumnsId[this.state.报警围栏字段]+","+this.state.bjtjColumnsId[this.state.日字段];
            this.state.综合X轴字号=9;
            this.state.zhAlignWithLabel=false;
        }
        else if(this.state.zhBarSearchFlag==this.state.月查询常量){
            $("#zhBar_search_type_div #month_but_div").css("color","#477A8F");
            $("#zhBar_search_type_div #month_but_div").css("border-bottom","#497DD0 solid 1px");

            disabledColIds=this.state.bjtjColumnsId[this.state.区域职能1字段]+","+this.state.bjtjColumnsId[this.state.所属部门字段]+","+this.state.bjtjColumnsId[this.state.报警围栏字段]+","+this.state.bjtjColumnsId[this.state.日字段]+","+this.state.bjtjColumnsId[this.state.月度周字段];
            this.state.综合X轴字号=9;
            this.state.zhAlignWithLabel=true;
        }

        Super.super({
            url:`api2/entity/${this.state.menuId}/list/tmpl`,
            method:'GET',
            query:{disabledColIds:disabledColIds,sortColIds:(this.state.bjtjColumnsId[this.state.日期字段]+"_ASC"),criteria_13:this.state.zhBarStartDate+"~"+this.state.zhBarEndDate}
        }).then((res) => {
            console.log(res);
            console.log("综合柱状图数据==="+JSON.stringify(res));
            this.state.zhBarQueryKey=res.queryKey;
            if(!this.state.zhBarReload){//这里是初始化报警类型，只有在首次加载页面的时候初始化一次就行
                res.ltmpl.criterias.map((item,index)=>{
                    if(item.id==6){
                        this.initZHBarlegendData(item.fieldId);
                    }
                });
            }
            else
                this.initZHBarListByQueryKey();
        })
    }
    initPieListByMenuId=(flag,reload)=>{
        this.state.pieSearchFlag=flag;
        this.state.pieReload=reload;
        let menuId="";
        let disabledColIds="";
        let startDate;
        let days;
        $("#pie_search_type_div #but_div div").css("color","#000");
        $("#pie_search_type_div #but_div div").css("border-bottom","#fff solid 1px");
        if(this.state.pieSearchFlag==this.state.日查询常量){
            $("#pie_search_type_div #date_but_div").css("color","#477A8F");
            $("#pie_search_type_div #date_but_div").css("border-bottom","#497DD0 solid 1px");

            menuId=96488554110993;
            disabledColIds="";
            days=-1;
        }
        else if(this.state.pieSearchFlag==this.state.周查询常量){
            $("#pie_search_type_div #week_but_div").css("color","#477A8F");
            $("#pie_search_type_div #week_but_div").css("border-bottom","#497DD0 solid 1px");

            menuId=this.state.menuId;
            disabledColIds=this.state.bjtjColumnsId[this.state.日字段];
            days=-7;
        }
        else if(this.state.pieSearchFlag==this.state.月查询常量){
            $("#pie_search_type_div #month_but_div").css("color","#477A8F");
            $("#pie_search_type_div #month_but_div").css("border-bottom","#497DD0 solid 1px");

            menuId=this.state.menuId;
            disabledColIds=this.state.bjtjColumnsId[this.state.日字段]+","+this.state.bjtjColumnsId[this.state.月度周字段];
            days=-30;
        }
        else if(this.state.pieSearchFlag==this.state.三个月查询常量) {
            $("#pie_search_type_div #three_month_but_div").css("color", "#477A8F");
            $("#pie_search_type_div #three_month_but_div").css("border-bottom", "#497DD0 solid 1px");

            menuId=this.state.menuId;
            days=-90;
        }

        startDate=this.getAddDate(days);
        let endDate=this.getTodayDate();
        //let endDate=this.getAddDate(1);
        Super.super({
            url:`api2/entity/${menuId}/list/tmpl`,
            method:'GET',
            query:{pageSize:this.state.pageSize,disabledColIds:disabledColIds,sortColIds:(this.state.bjtjColumnsId[this.state.日期字段]+"_ASC"),criteria_13:startDate+"~"+endDate}
        }).then((res) => {
            console.log("饼状图数据==="+JSON.stringify(res));
            this.state.pieQueryKey=res.queryKey;
            if(!this.state.pieReload){//这里是初始化报警类型，只有在首次加载页面的时候初始化一次就行
                this.initPielegendData(this.state.bjtjColumnsFieldId[this.state.电子围栏字段]);
            }
            else
                this.initPieListByQueryKey();
        })
    }
    initZHPieListByMenuId=(flag,reload)=>{
        this.state.zhPieSearchFlag=flag;
        this.state.zhPieReload=reload;
        let menuId="";
        let disabledColIds="";
        let startDate;
        let days;
        $("#zhPie_search_type_div #but_div div").css("color","#000");
        $("#zhPie_search_type_div #but_div div").css("border-bottom","#fff solid 1px");
        if(this.state.zhPieSearchFlag==this.state.日查询常量){
            $("#zhPie_search_type_div #date_but_div").css("color","#477A8F");
            $("#zhPie_search_type_div #date_but_div").css("border-bottom","#497DD0 solid 1px");

            menuId=96488554110993;
            disabledColIds=this.state.bjtjColumnsId[this.state.区域职能1字段]+","+this.state.bjtjColumnsId[this.state.所属部门字段]+","+this.state.bjtjColumnsId[this.state.报警围栏字段];
            days=-1;
        }
        else if(this.state.zhPieSearchFlag==this.state.周查询常量){
            $("#zhPie_search_type_div #week_but_div").css("color","#477A8F");
            $("#zhPie_search_type_div #week_but_div").css("border-bottom","#497DD0 solid 1px");

            menuId=this.state.menuId;
            disabledColIds=this.state.bjtjColumnsId[this.state.区域职能1字段]+","+this.state.bjtjColumnsId[this.state.所属部门字段]+","+this.state.bjtjColumnsId[this.state.日字段];
            days=-7;
        }
        else if(this.state.zhPieSearchFlag==this.state.月查询常量){
            $("#zhPie_search_type_div #month_but_div").css("color","#477A8F");
            $("#zhPie_search_type_div #month_but_div").css("border-bottom","#497DD0 solid 1px");

            menuId=this.state.menuId;
            disabledColIds=this.state.bjtjColumnsId[this.state.日字段]+","+this.state.bjtjColumnsId[this.state.月度周字段];
            days=-30;
        }
        else if(this.state.zhPieSearchFlag==this.state.三个月查询常量) {
            $("#zhPie_search_type_div #three_month_but_div").css("color", "#477A8F");
            $("#zhPie_search_type_div #three_month_but_div").css("border-bottom", "#497DD0 solid 1px");

            menuId=this.state.menuId;
            days=-90;
        }

        startDate=this.getAddDate(days);
        let endDate=this.getTodayDate();
        //let endDate=this.getAddDate(1);
        Super.super({
            url:`api2/entity/${menuId}/list/tmpl`,
            method:'GET',
            query:{pageSize:this.state.pageSize,disabledColIds:disabledColIds,sortColIds:(this.state.bjtjColumnsId[this.state.日期字段]+"_ASC"),criteria_13:startDate+"~"+endDate}
        }).then((res) => {
            console.log("综合饼状图数据==="+JSON.stringify(res));
            this.state.zhPieQueryKey=res.queryKey;
            if(!this.state.zhPieReload){//这里是初始化报警类型，只有在首次加载页面的时候初始化一次就行
                this.initZHPielegendData(this.state.bjtjColumnsFieldId[this.state.区域职能2字段]);
            }
            else
                this.initZHPieListByQueryKey();
        })
    }
    initBarListByQueryKey=()=>{
        Super.super({
            url:`api2/entity/list/${this.state.barQueryKey}/data`,
            method:'GET',
            query:{pageSize:this.state.pageSize}
        }).then((res) => {
            this.initBarXAxisData(res);
            this.initBarSeriesDataList();
            this.initYAxisData(res);
            if(!this.state.reload)
                this.initTodayBjCount(res);
        })
    }
    initZHBarListByQueryKey=()=>{
        Super.super({
            url:`api2/entity/list/${this.state.zhBarQueryKey}/data`,
            method:'GET',
            query:{pageSize:this.state.pageSize}
        }).then((res) => {
            this.initZHBarXAxisData(res);
            this.initZHBarSeriesDataList();
            this.initZHYAxisData(res);
        })
    }
    initPieListByQueryKey=()=>{
        Super.super({
            url:`api2/entity/list/${this.state.pieQueryKey}/data`,
            method:'GET',
            query:{pageSize:this.state.pageSize}
        }).then((res) =>{
            this.initPieSeriesDataList(res);
        })
    }
    initZHPieListByQueryKey=()=>{
        Super.super({
            url:`api2/entity/list/${this.state.zhPieQueryKey}/data`,
            method:'GET',
            query:{pageSize:this.state.pageSize}
        }).then((res) =>{
            this.initZHPieSeriesDataList(res);
        })
    }
    initBarlegendData=(fieldId)=>{
        Super.super({
            url:`api2/meta/dict/field_options`,
            method:'GET',
            query: {fieldIds:fieldId}
        }).then((res) => {
            console.log(res.optionsMap[fieldId]);
            let ldMap=[];
            let series=[];
            let ldValueJj=null;
            let ldValueQc=null;
            let ldValueZc=null;
            let ldValueJz=null;
            let todayBjCountList=this.state.todayBjCountList;
            let barSeriesNameList=this.state.barSeriesNameList;
            let barSeriesDataList=this.state.barSeriesDataList;
            let barSeriesColorList=this.state.barSeriesColorList;
            res.optionsMap[fieldId].map((item,index)=>{
                let 数据库里报警类型=this.state.报警类型数据库里名称;
                let 手机端报警类型=this.state.报警类型手机端显示名称;
                let color;
                switch (item.title) {
                    case 数据库里报警类型.紧急报警:
                        if(ldValueJj==null){
                            ldValueJj=手机端报警类型.紧急报警;
                            todayBjCountList[ldValueJj]=0;

                            color="#F00";
                            barSeriesNameList.push(ldValueJj);
                            barSeriesDataList[ldValueJj]=[];
                            barSeriesColorList[ldValueJj]=color;
                            //series.push({name:ldValueJj,type:'bar',data:[],barGap:0,itemStyle:{normal:{color:color}}});
                            ldMap.push(ldValueJj);
                        }
                        break;
                    case 数据库里报警类型.缺员报警:
                    case 数据库里报警类型.超员报警:
                        if(ldValueQc==null){
                            ldValueQc=手机端报警类型.缺员超员报警;
                            todayBjCountList[ldValueQc]=0;

                            //console.log(手机端报警类型.缺员超员报警)
                            color="#0F0";
                            barSeriesNameList.push(ldValueQc);
                            barSeriesDataList[ldValueQc]=[];
                            barSeriesColorList[ldValueQc]=color;
                            //series.push({name:ldValueQc,type:'bar',data:[],barGap:0,itemStyle:{normal:{color:color}}});
                            ldMap.push(ldValueQc);
                        }
                        break;
                    case 数据库里报警类型.滞留报警:
                    case 数据库里报警类型.串岗报警:
                        if(ldValueZc==null){
                            ldValueZc=手机端报警类型.串岗滞留报警;
                            todayBjCountList[ldValueZc]=0;

                            color="#00F";
                            barSeriesNameList.push(ldValueZc);
                            barSeriesDataList[ldValueZc]=[];
                            barSeriesColorList[ldValueZc]=color;
                            //series.push({name:ldValueZc,type:'bar',data:[],barGap:0,itemStyle:{normal:{color:color}}});
                            ldMap.push(ldValueZc);
                        }
                        break;
                    case 数据库里报警类型.静止报警:
                        if(ldValueJz==null){
                            ldValueJz=手机端报警类型.静止报警;
                            todayBjCountList[ldValueJz]=0;

                            color="#2f2f4f";
                            barSeriesNameList.push(ldValueJz);
                            barSeriesDataList[ldValueJz]=[];
                            barSeriesColorList[ldValueJz]=color;
                            //series.push({name:ldValueJz,type:'bar',data:[],barGap:0,itemStyle:{normal:{color:color}}});
                            ldMap.push(ldValueJz);
                        }
                        break;
                        /*
                    case 4:
                        color="#2191DB";
                        break;
                    case 5:
                        color="#9D9D9D";
                        break;
                         */
                }
            });
            this.setState({barLegendData:ldMap});
            //this.setState({series:series});
            this.initBarListByQueryKey();
        })
    }
    initZHBarlegendData=(fieldId)=>{
        Super.super({
            url:`api2/meta/dict/field_options`,
            method:'GET',
            query: {fieldIds:fieldId}
        }).then((res) => {
            console.log(res.optionsMap[fieldId]);
            let ldMap=[];
            let ldValueJj=null;
            let ldValueQc=null;
            let ldValueZc=null;
            let ldValueJz=null;
            let zhBarSeriesNameList=this.state.zhBarSeriesNameList;
            let zhBarSeriesDataList=this.state.zhBarSeriesDataList;
            let zhBarSeriesColorList=this.state.zhBarSeriesColorList;
            res.optionsMap[fieldId].map((item,index)=>{
                let 数据库里报警类型=this.state.报警类型数据库里名称;
                let 手机端报警类型=this.state.报警类型手机端显示名称;
                let color;
                switch (item.title) {
                    case 数据库里报警类型.紧急报警:
                        if(ldValueJj==null){
                            ldValueJj=手机端报警类型.紧急报警;

                            color="#F00";
                            zhBarSeriesNameList.push(ldValueJj);
                            zhBarSeriesDataList[ldValueJj]=[];
                            zhBarSeriesColorList[ldValueJj]=color;
                            //series.push({name:ldValueJj,type:'bar',data:[],barGap:0,itemStyle:{normal:{color:color}}});
                            ldMap.push(ldValueJj);
                        }
                        break;
                    case 数据库里报警类型.缺员报警:
                    case 数据库里报警类型.超员报警:
                        if(ldValueQc==null){
                            ldValueQc=手机端报警类型.缺员超员报警;

                            //console.log(手机端报警类型.缺员超员报警)
                            color="#0F0";
                            zhBarSeriesNameList.push(ldValueQc);
                            zhBarSeriesDataList[ldValueQc]=[];
                            zhBarSeriesColorList[ldValueQc]=color;
                            //series.push({name:ldValueQc,type:'bar',data:[],barGap:0,itemStyle:{normal:{color:color}}});
                            ldMap.push(ldValueQc);
                        }
                        break;
                    case 数据库里报警类型.滞留报警:
                    case 数据库里报警类型.串岗报警:
                        if(ldValueZc==null){
                            ldValueZc=手机端报警类型.串岗滞留报警;

                            color="#00F";
                            zhBarSeriesNameList.push(ldValueZc);
                            zhBarSeriesDataList[ldValueZc]=[];
                            zhBarSeriesColorList[ldValueZc]=color;
                            //series.push({name:ldValueZc,type:'bar',data:[],barGap:0,itemStyle:{normal:{color:color}}});
                            ldMap.push(ldValueZc);
                        }
                        break;
                    case 数据库里报警类型.静止报警:
                        if(ldValueJz==null){
                            ldValueJz=手机端报警类型.静止报警;

                            color="#2f2f4f";
                            zhBarSeriesNameList.push(ldValueJz);
                            zhBarSeriesDataList[ldValueJz]=[];
                            zhBarSeriesColorList[ldValueJz]=color;
                            //series.push({name:ldValueJz,type:'bar',data:[],barGap:0,itemStyle:{normal:{color:color}}});
                            ldMap.push(ldValueJz);
                        }
                        break;
                }
            });
            this.setState({zhBarLegendData:ldMap});
            //this.setState({series:series});
            this.initZHBarListByQueryKey();
        })
    }
    initPielegendData=(fieldId)=>{
        Super.super({
            url:`api2/ks/clist/elefence/list/data`,
            method:'GET',
            query: {fieldIds:fieldId,pageSize:this.state.pageSize}
        }).then((res) => {
            console.log("elefence==="+JSON.stringify(res.result.entities))
            let pieLegendData=[];
            this.state.bjqySelectList=res.result.entities;
            this.state.bjqySelectList.map((item,index)=>{
                pieLegendData.push(item["默认字段组"]["围栏编码"]+"@R@"+item["默认字段组"]["名称"]);
            });

            this.setState({pieLegendData:pieLegendData});
            this.initPieListByQueryKey();
        });
    }
    initZHPielegendData=(fieldId)=>{
        Super.super({
            //url:`api2/ks/clist/elefence/list/data`,
            url:`api2/meta/dict/field_options`,
            method:'GET',
            query: {fieldIds:fieldId,pageSize:this.state.pageSize}
        }).then((res) => {
            console.log("111elefence==="+JSON.stringify(res.optionsMap[fieldId]))
            let zhPieLegendData=[];
            this.state.zhBjqySelectList=res.optionsMap[fieldId];
            this.state.zhBjqySelectList.map((item,index)=>{
                console.log("????==="+(item.value))
                zhPieLegendData.push(item.value);
            });

            this.setState({zhPieLegendData:zhPieLegendData});
            this.initZHPieListByQueryKey();
        });
    }
    initBarXAxisData=(res)=>{
        let xAxisData=[];
        res.entities.map((item,index)=>{
            let cellMap=item.cellMap;
            //console.log("cellMap==="+JSON.stringify(cellMap));
            if(this.state.barSearchFlag==this.state.日查询常量){
                if(!this.checkBarXAxisDataExist(xAxisData,cellMap[this.state.bjtjColumnsId[this.state.月字段]]+"-"+cellMap[this.state.bjtjColumnsId[this.state.日字段]])){
                    xAxisData.push(cellMap[this.state.bjtjColumnsId[this.state.月字段]]+"-"+cellMap[this.state.bjtjColumnsId[this.state.日字段]]);
                }
            }
            else if(this.state.barSearchFlag==this.state.周查询常量){
                let fxd=this.formatterXAxisData(cellMap,this.state.barSearchFlag)
                if(!this.checkBarXAxisDataExist(xAxisData,fxd))
                    xAxisData.push(fxd);
            }
            else if(this.state.barSearchFlag==this.state.月查询常量){
                if(!this.checkBarXAxisDataExist(xAxisData,cellMap[this.state.bjtjColumnsId[this.state.月字段]]))
                    xAxisData.push(cellMap[this.state.bjtjColumnsId[this.state.月字段]]);
            }
        });
        console.log("series==="+JSON.stringify(this.state.series));
        this.setState({xAxisData:xAxisData});
    }
    initZHBarXAxisData=(res)=>{
        let xAxisData=[];
        res.entities.map((item,index)=>{
            let cellMap=item.cellMap;
            console.log("综合cellMap==="+JSON.stringify(cellMap));
            if(this.state.zhBarSearchFlag==this.state.日查询常量){
                if(!this.checkBarXAxisDataExist(xAxisData,cellMap[this.state.bjtjColumnsId[this.state.月字段]]+"-"+cellMap[this.state.bjtjColumnsId[this.state.日字段]])){
                    xAxisData.push(cellMap[this.state.bjtjColumnsId[this.state.月字段]]+"-"+cellMap[this.state.bjtjColumnsId[this.state.日字段]]);
                }
            }
            else if(this.state.zhBarSearchFlag==this.state.周查询常量){
                let fxd=this.formatterXAxisData(cellMap,this.state.zhBarSearchFlag)
                if(!this.checkBarXAxisDataExist(xAxisData,fxd))
                    xAxisData.push(fxd);
            }
            else if(this.state.zhBarSearchFlag==this.state.月查询常量){
                if(!this.checkBarXAxisDataExist(xAxisData,cellMap[this.state.bjtjColumnsId[this.state.月字段]]))
                    xAxisData.push(cellMap[this.state.bjtjColumnsId[this.state.月字段]]);
            }
        });
        console.log("zhXAxisData==="+xAxisData)
        this.setState({zhxAxisData:xAxisData});
    }
    initYAxisData=(res)=>{
        console.log("111==="+JSON.stringify(res.entities));
        let series=[];
        let seriesData;
        res.entities.map((item,index)=>{
            let cellMap=item.cellMap;
            let 数据库报警类型=this.state.报警类型数据库里名称;
            let 手机端报警类型=this.state.报警类型手机端显示名称;
            let 数报警类型=cellMap[this.state.bjtjColumnsId[this.state.报警类型字段]];
            let 手报警类型;
            if(数据库报警类型.紧急报警==数报警类型)
                手报警类型=手机端报警类型.紧急报警;
            else if(数据库报警类型.超员报警==数报警类型||数据库报警类型.缺员报警==数报警类型)
                手报警类型=手机端报警类型.缺员超员报警;
            else if(数据库报警类型.串岗报警==数报警类型||数据库报警类型.滞留报警==数报警类型)
                手报警类型=手机端报警类型.串岗滞留报警;
            else if(数据库报警类型.静止报警==数报警类型)
                手报警类型=手机端报警类型.静止报警;

            if(this.state.barSearchFlag==this.state.日查询常量){
                this.state.barSeriesDataList[手报警类型].map((sdItem,sdIndex)=>{
                    console.log(sdItem.xLabel+","+cellMap[this.state.bjtjColumnsId[this.state.月字段]]+"-"+cellMap[this.state.bjtjColumnsId[this.state.日字段]]);
                    if(sdItem.xLabel==cellMap[this.state.bjtjColumnsId[this.state.月字段]]+"-"+cellMap[this.state.bjtjColumnsId[this.state.日字段]]){
                        sdItem.yLabel=sdItem.yLabel+=parseInt(cellMap[this.state.bjtjColumnsId[this.state.数量字段]]);
                    }
                });
            }
            else if(this.state.barSearchFlag==this.state.周查询常量){
                this.state.barSeriesDataList[手报警类型].map((sdItem,sdIndex)=>{
                    if(sdItem.xLabel==this.formatterXAxisData(cellMap,this.state.周查询常量)){
                        //console.log(sdItem.xLabel+","+cellMap[this.state.报警类型]+","+cellMap[this.state.数量])
                        sdItem.yLabel=sdItem.yLabel+=parseInt(cellMap[this.state.bjtjColumnsId[this.state.数量字段]]);
                    }
                });
            }
            else if(this.state.barSearchFlag==this.state.月查询常量){
                this.state.barSeriesDataList[手报警类型].map((sdItem,sdIndex)=>{
                    if(sdItem.xLabel==cellMap[this.state.bjtjColumnsId[this.state.月字段]]){
                        //console.log(sdItem.xLabel+","+cellMap[this.state.报警类型]+","+cellMap[this.state.数量])
                        sdItem.yLabel=sdItem.yLabel+=parseInt(cellMap[this.state.bjtjColumnsId[this.state.数量字段]]);
                    }
                });
            }
            console.log(手报警类型+":"+JSON.stringify(this.state.barSeriesDataList[手报警类型]))//经测试没问题
        });

        this.state.barLegendData.map((item,index)=>{
            let data=[];
            this.state.barSeriesDataList[item].map((sdItem,sdIndex)=>{
                data.push(sdItem.yLabel);
            });
            series.push({name:item,type:'bar',data:data,barGap:0,itemStyle:{normal:{color:this.state.barSeriesColorList[item]}}});
        });
        this.setState({series:series});
    }
    initZHYAxisData=(res)=>{
        console.log("综合111==="+JSON.stringify(res.entities));
        let series=[];
        res.entities.map((item,index)=>{
            let cellMap=item.cellMap;
            let 数据库报警类型=this.state.报警类型数据库里名称;
            let 手机端报警类型=this.state.报警类型手机端显示名称;
            let 数报警类型=cellMap[this.state.bjtjColumnsId[this.state.报警类型字段]];
            let 手报警类型;
            if(数据库报警类型.紧急报警==数报警类型)
                手报警类型=手机端报警类型.紧急报警;
            else if(数据库报警类型.超员报警==数报警类型||数据库报警类型.缺员报警==数报警类型)
                手报警类型=手机端报警类型.缺员超员报警;
            else if(数据库报警类型.串岗报警==数报警类型||数据库报警类型.滞留报警==数报警类型)
                手报警类型=手机端报警类型.串岗滞留报警;
            else if(数据库报警类型.静止报警==数报警类型)
                手报警类型=手机端报警类型.静止报警;

            if(this.state.zhBarSearchFlag==this.state.日查询常量){
                this.state.zhBarSeriesDataList[手报警类型].map((sdItem,sdIndex)=>{
                    console.log(sdItem.xLabel+","+cellMap[this.state.bjtjColumnsId[this.state.月字段]]+"-"+cellMap[this.state.bjtjColumnsId[this.state.日字段]]);
                    if(sdItem.xLabel==cellMap[this.state.bjtjColumnsId[this.state.月字段]]+"-"+cellMap[this.state.bjtjColumnsId[this.state.日字段]]){
                        sdItem.yLabel=sdItem.yLabel+=parseInt(cellMap[this.state.bjtjColumnsId[this.state.数量字段]]);
                    }
                });
            }
            else if(this.state.zhBarSearchFlag==this.state.周查询常量){
                this.state.zhBarSeriesDataList[手报警类型].map((sdItem,sdIndex)=>{
                    if(sdItem.xLabel==this.formatterXAxisData(cellMap,this.state.周查询常量)){
                        //console.log(sdItem.xLabel+","+cellMap[this.state.报警类型]+","+cellMap[this.state.数量])
                        sdItem.yLabel=sdItem.yLabel+=parseInt(cellMap[this.state.bjtjColumnsId[this.state.数量字段]]);
                    }
                });
            }
            else if(this.state.zhBarSearchFlag==this.state.月查询常量){
                this.state.zhBarSeriesDataList[手报警类型].map((sdItem,sdIndex)=>{
                    if(sdItem.xLabel==cellMap[this.state.bjtjColumnsId[this.state.月字段]]){
                        //console.log(sdItem.xLabel+","+cellMap[this.state.报警类型]+","+cellMap[this.state.数量])
                        sdItem.yLabel=sdItem.yLabel+=parseInt(cellMap[this.state.bjtjColumnsId[this.state.数量字段]]);
                    }
                });
            }
            console.log(手报警类型+":"+JSON.stringify(this.state.barSeriesDataList[手报警类型]))//经测试没问题
        });

        this.state.zhBarLegendData.map((item,index)=>{
            let data=[];
            this.state.zhBarSeriesDataList[item].map((sdItem,sdIndex)=>{
                data.push(sdItem.yLabel);
            });
            series.push({name:item,type:'bar',data:data,barGap:0,itemStyle:{normal:{color:this.state.zhBarSeriesColorList[item]}}});
        });
        this.setState({zhSeries:series});
    }
    initTodayBjCount=(res)=>{
        let todayDate=this.getTodayDate();
        let todayBjCountList=this.state.todayBjCountList;
        if(this.state.barReload){
            for(let key in todayBjCountList){
                todayBjCountList[key]=0;
            }
        }

        res.entities.map((item,index)=>{
            let cellMap=item.cellMap;
            //console.log("todayDate==="+todayDate+","+cellMap[this.state.bjtjColumnsId[this.state.日期字段]])
            if(todayDate==cellMap[this.state.bjtjColumnsId[this.state.日期字段]]){
                let 数据库报警类型=this.state.报警类型数据库里名称;
                let 手机端报警类型=this.state.报警类型手机端显示名称;
                let 数报警类型=cellMap[this.state.bjtjColumnsId[this.state.报警类型字段]];
                let 手报警类型;
                if(数据库报警类型.紧急报警==数报警类型)
                    手报警类型=手机端报警类型.紧急报警;
                else if(数据库报警类型.超员报警==数报警类型||数据库报警类型.缺员报警==数报警类型)
                    手报警类型=手机端报警类型.缺员超员报警;
                else if(数据库报警类型.串岗报警==数报警类型||数据库报警类型.滞留报警==数报警类型)
                    手报警类型=手机端报警类型.串岗滞留报警;
                else if(数据库报警类型.静止报警==数报警类型)
                    手报警类型=手机端报警类型.静止报警;
                todayBjCountList[手报警类型]+=parseInt(cellMap[this.state.bjtjColumnsId[this.state.数量字段]]);
            }
        });
        this.setState({todayBjCountList:todayBjCountList});
    }
    getTodayDate=()=>{
        let date=new Date();
        let year=date.getFullYear();
        let month=date.getMonth()+1;
        let dateOfMonth=date.getDate();
        let todayDate=year+"-"+(month<10?"0"+month:month)+"-"+(dateOfMonth<10?"0"+dateOfMonth:dateOfMonth);
        return todayDate;
    }
    getAddDate=(days)=>{
        let date=new Date();
        date=new Date(date.setDate(date.getDate()+days));
        let year=date.getFullYear();
        let month=date.getMonth()+1;
        let dateOfMonth=date.getDate();
        return year+"-"+(month<10?"0"+month:month)+"-"+(dateOfMonth<10?"0"+dateOfMonth:dateOfMonth);
    }
    initBarSeriesDataList=()=>{
        //先把上次加载的数据清空
        this.state.barLegendData.map((item,index)=>{
            this.state.barSeriesDataList[item]=[];
        });

        //清空上次加载的数据后，再加载新数据
        this.state.xAxisData.map((xItem)=>{
            console.log("xItem==="+xItem)
            this.state.barLegendData.map((legItem,index)=>{
                this.state.barSeriesDataList[legItem].push({"xLabel":xItem,"yLabel":0});
            });
        });
    }
    initZHBarSeriesDataList=()=>{
        //先把上次加载的数据清空
        this.state.zhBarLegendData.map((item,index)=>{
            this.state.zhBarSeriesDataList[item]=[];
        });

        //清空上次加载的数据后，再加载新数据
        this.state.zhxAxisData.map((xItem)=>{
            console.log("综合xItem==="+xItem)
            this.state.zhBarLegendData.map((legItem,index)=>{
                this.state.zhBarSeriesDataList[legItem].push({"xLabel":xItem,"yLabel":0});
            });
        });
    }
    initPieSeriesDataList=(res)=>{
        let entities=res.entities;
        let bjqySelectList=this.state.bjqySelectList;
        let pieSeriesDataList=[];
        console.log("饼状图数据entities==="+JSON.stringify(entities))
        console.log("bjqySelectList==="+JSON.stringify(bjqySelectList))
        entities.map((item,index)=> {
            bjqySelectList.map((bjqylItem,bjqylIndex)=>{
                let cellMap = item.cellMap;
                console.log("===+++"+JSON.stringify(cellMap))
                if(this.state.pieSearchFlag==this.state.日查询常量){
                    console.log(bjqylItem["默认字段组"]["围栏编码"]==cellMap[this.state.bjtjColumnsId[this.state.电子围栏字段]])
                    if(bjqylItem["默认字段组"]["围栏编码"]==cellMap[this.state.bjtjColumnsId[this.state.电子围栏字段]]){
                        let bjlxList=[];
                        this.state.barLegendData.map((bjlxItem,bjlxIndex)=>{
                            let 数据库报警类型=this.state.报警类型数据库里名称;
                            let 手机端报警类型=this.state.报警类型手机端显示名称;
                            let 数报警类型=cellMap[this.state.bjtjColumnsId[this.state.报警类型字段]];
                            let 手报警类型;
                            if(数据库报警类型.紧急报警==数报警类型)
                                手报警类型=手机端报警类型.紧急报警;
                            else if(数据库报警类型.超员报警==数报警类型||数据库报警类型.缺员报警==数报警类型)
                                手报警类型=手机端报警类型.缺员超员报警;
                            else if(数据库报警类型.串岗报警==数报警类型||数据库报警类型.滞留报警==数报警类型)
                                手报警类型=手机端报警类型.串岗滞留报警;
                            else if(数据库报警类型.静止报警==数报警类型)
                                手报警类型=手机端报警类型.静止报警;

                            console.log("bjlxItem=="+bjlxItem+",手报警类型==="+手报警类型+",bjqy==="+bjqylItem["默认字段组"]["名称"])
                            if(bjlxItem==手报警类型){
                                bjlxList.push({name:手报警类型,count:cellMap[this.state.bjtjColumnsId[this.state.总数量字段]]});
                            }
                        });
                        //pieSeriesDataList.push({value: 1548,name: '一车间', selected: true});
                        pieSeriesDataList.push({value: 1548,name: bjqylItem["默认字段组"]["围栏编码"]+"@R@"+bjqylItem["默认字段组"]["名称"],bjlxList:bjlxList, selected: (bjqylIndex%2==1)?true:false});
                    }
                }
                else{
                    console.log("+++2---"+(bjqylItem["默认字段组"]["围栏编码"]+","+this.substringItemValue(cellMap[this.state.bjtjColumnsId[this.state.报警围栏字段]],0)))
                    if(bjqylItem["默认字段组"]["围栏编码"]==this.substringItemValue(cellMap[this.state.bjtjColumnsId[this.state.报警围栏字段]],0)){
                        let bjqyValue;
                        let bjqy=bjqylItem["默认字段组"]["围栏编码"]+"@R@"+bjqylItem["默认字段组"]["名称"];
                        let bjlxList;
                        let exist=this.checkBjqyExistInPSDList(pieSeriesDataList,bjqy)
                        if(exist){
                            pieSeriesDataList.map((psdItem,psdIndex)=>{
                                if(psdItem.name==bjqy){
                                    bjqyValue=psdItem.value;
                                    bjlxList=psdItem.bjlxList;
                                    return true;
                                }
                            });
                        }
                        else{
                            bjqyValue=0;
                            bjlxList=[];
                        }
                        this.state.barLegendData.map((bjlxItem,bjlxIndex)=>{
                            let 数据库报警类型=this.state.报警类型数据库里名称;
                            let 手机端报警类型=this.state.报警类型手机端显示名称;
                            let 数报警类型=cellMap[this.state.bjtjColumnsId[this.state.报警类型字段]];
                            let 手报警类型;
                            if(数据库报警类型.紧急报警==数报警类型)
                                手报警类型=手机端报警类型.紧急报警;
                            else if(数据库报警类型.超员报警==数报警类型||数据库报警类型.缺员报警==数报警类型)
                                手报警类型=手机端报警类型.缺员超员报警;
                            else if(数据库报警类型.串岗报警==数报警类型||数据库报警类型.滞留报警==数报警类型)
                                手报警类型=手机端报警类型.串岗滞留报警;
                            else if(数据库报警类型.静止报警==数报警类型)
                                手报警类型=手机端报警类型.静止报警;

                            //console.log("bjlxItem=="+bjlxItem+",手报警类型==="+手报警类型+",bjqy==="+bjqylItem["默认字段组"]["名称"])
                            if(bjlxItem==手报警类型){
                                let count=parseInt(cellMap[this.state.bjtjColumnsId[this.state.数量字段]]);
                                bjqyValue+=count;
                                let bjlxExist=this.checkBjlxExistInList(bjlxList,bjlxItem)
                                //console.log("bjlxExist==="+bjlxExist)
                                if(bjlxExist){
                                    bjlxList.map((bjlxlItem,bjlxlIndex)=>{
                                        if(bjlxlItem.name==bjlxItem){
                                            bjlxlItem.count+=count;
                                            return true;
                                        }
                                    });
                                }
                                else{
                                    bjlxList.push({name:手报警类型,count:count});
                                }
                            }
                        });
                        //pieSeriesDataList.push({value: 1548,name: '一车间', selected: true});
                        if(exist){
                            pieSeriesDataList.map((psdItem,psdIndex)=>{
                                if(psdItem.name==bjqy){
                                    psdItem.value=bjqyValue;
                                    return true;
                                }
                            });
                        }
                        else{
                            pieSeriesDataList.push({value: bjqyValue,name: bjqy,bjlxList:bjlxList, selected: (bjqylIndex%2==1)?true:false});
                        }
                    }
                }
            });
        });
        this.setState({pieSeriesDataList:pieSeriesDataList});
        console.log(JSON.stringify(pieSeriesDataList))
    }
    initZHPieSeriesDataList=(res)=>{
        let entities=res.entities;
        let zhBjqySelectList=this.state.zhBjqySelectList;
        let zhPieSeriesDataList=[];
        console.log("综合饼状图数据res==="+JSON.stringify(res))
        console.log("zhBjqySelectList==="+JSON.stringify(zhBjqySelectList))
        entities.map((item,index)=> {
            zhBjqySelectList.map((bjqylItem,bjqylIndex)=>{
                let cellMap = item.cellMap;
                console.log("===+++"+JSON.stringify(cellMap))
                if(this.state.zhPieSearchFlag==this.state.日查询常量){
                    console.log(bjqylItem.value==cellMap[this.state.bjtjColumnsId[this.state.区域职能2字段]])
                    if(bjqylItem.value==cellMap[this.state.bjtjColumnsId[this.state.区域职能2字段]]){
                        let bjlxList=[];
                        this.state.zhBarLegendData.map((bjlxItem,bjlxIndex)=>{
                            let 数据库报警类型=this.state.报警类型数据库里名称;
                            let 手机端报警类型=this.state.报警类型手机端显示名称;
                            let 数报警类型=cellMap[this.state.bjtjColumnsId[this.state.报警类型字段]];
                            let 手报警类型;
                            if(数据库报警类型.紧急报警==数报警类型)
                                手报警类型=手机端报警类型.紧急报警;
                            else if(数据库报警类型.超员报警==数报警类型||数据库报警类型.缺员报警==数报警类型)
                                手报警类型=手机端报警类型.缺员超员报警;
                            else if(数据库报警类型.串岗报警==数报警类型||数据库报警类型.滞留报警==数报警类型)
                                手报警类型=手机端报警类型.串岗滞留报警;
                            else if(数据库报警类型.静止报警==数报警类型)
                                手报警类型=手机端报警类型.静止报警;

                            console.log("bjlxItem=="+bjlxItem+",手报警类型==="+手报警类型+",bjqy==="+bjqylItem["默认字段组"]["名称"])
                            if(bjlxItem==手报警类型){
                                bjlxList.push({name:手报警类型,count:cellMap[this.state.bjtjColumnsId[this.state.总数量字段]]});
                            }
                        });
                        //pieSeriesDataList.push({value: 1548,name: '一车间', selected: true});
                        zhPieSeriesDataList.push({value: 1548,name: bjqylItem.value,bjlxList:bjlxList, selected: (bjqylIndex%2==1)?true:false});
                    }
                }
                else{
                    console.log("+++2---"+bjqylItem.value+","+cellMap[this.state.bjtjColumnsId[this.state.区域职能2字段]])
                    if(bjqylItem.value==cellMap[this.state.bjtjColumnsId[this.state.区域职能2字段]]){
                        let bjqyValue;
                        let bjqy=bjqylItem.value;
                        let bjlxList;
                        let exist=this.checkBjqyExistInPSDList(zhPieSeriesDataList,bjqy)
                        if(exist){
                            zhPieSeriesDataList.map((psdItem,psdIndex)=>{
                                if(psdItem.name==bjqy){
                                    bjqyValue=psdItem.value;
                                    bjlxList=psdItem.bjlxList;
                                    return true;
                                }
                            });
                        }
                        else{
                            bjqyValue=0;
                            bjlxList=[];
                        }
                        this.state.zhBarLegendData.map((bjlxItem,bjlxIndex)=>{
                            let 数据库报警类型=this.state.报警类型数据库里名称;
                            let 手机端报警类型=this.state.报警类型手机端显示名称;
                            let 数报警类型=cellMap[this.state.bjtjColumnsId[this.state.报警类型字段]];
                            let 手报警类型;
                            if(数据库报警类型.紧急报警==数报警类型)
                                手报警类型=手机端报警类型.紧急报警;
                            else if(数据库报警类型.超员报警==数报警类型||数据库报警类型.缺员报警==数报警类型)
                                手报警类型=手机端报警类型.缺员超员报警;
                            else if(数据库报警类型.串岗报警==数报警类型||数据库报警类型.滞留报警==数报警类型)
                                手报警类型=手机端报警类型.串岗滞留报警;
                            else if(数据库报警类型.静止报警==数报警类型)
                                手报警类型=手机端报警类型.静止报警;

                            if(bjlxItem==手报警类型){
                                let count=parseInt(cellMap[this.state.bjtjColumnsId[this.state.数量字段]]);
                                bjqyValue+=count;
                                bjlxList.push({name:手报警类型,count:count});
                            }
                        });
                        //pieSeriesDataList.push({value: 1548,name: '一车间', selected: true});
                        if(exist){
                            zhPieSeriesDataList.map((psdItem,psdIndex)=>{
                                if(psdItem.name==bjqy){
                                    psdItem.value=bjqyValue;
                                    return true;
                                }
                            });
                        }
                        else{
                            console.log("bjqy==="+bjqy)
                            zhPieSeriesDataList.push({value: bjqyValue,name: bjqy,bjlxList:bjlxList, selected: (bjqylIndex%2==1)?true:false});
                        }
                    }
                }
            });
        });
        this.setState({zhPieSeriesDataList:zhPieSeriesDataList});
        console.log(JSON.stringify(zhPieSeriesDataList))
    }
    checkBjqyExistInPSDList=(list,bjqy)=>{
        let flag=false;
        list.map((item,index)=>{
            if(item.name==bjqy){
                flag=true;
                return flag;
            }
        });
        return flag;
    }
    checkBjlxExistInList=(list,bjlx)=>{
        let flag=false;
        list.map((item,index)=>{
            if(item.name==bjlx){
                flag=true;
                return flag;
            }
        });
        return flag;
    }
    checkBarXAxisDataExist=(xAxisData,xData)=>{
        let exist=false;
        xAxisData.map((item,index)=>{
            if(item==xData){
                exist=true;
                return exist;
            }
        });
        return exist;
    }
    formatterXAxisData=(cellMap,searchFlag)=>{
        let label;
        if(searchFlag==this.state.周查询常量){
            let date=cellMap[this.state.bjtjColumnsId[this.state.日期字段]];
            let day=date.substring(8);
            if(day>=1&day<=7)
                label=cellMap[this.state.bjtjColumnsId[this.state.月字段]]+".1-"+cellMap[this.state.bjtjColumnsId[this.state.月字段]]+".7";
            else if(day>=8&day<=14)
                label=cellMap[this.state.bjtjColumnsId[this.state.月字段]]+".8-"+cellMap[this.state.bjtjColumnsId[this.state.月字段]]+".14";
            else if(day>=15&day<=21)
                label=cellMap[this.state.bjtjColumnsId[this.state.月字段]]+".15-"+cellMap[this.state.bjtjColumnsId[this.state.月字段]]+".21";
            else if(day>=22&day<=31){
                let month=date.substring(5,7);
                let lastDay;
                if(month==1||month==3||month==5||month==7||month==8||month==10||month==12)
                    lastDay=31;
                else if(month==2){
                    let year=date.substring(0,4);
                    if(year%4==0)
                        lastDay=29;
                    else
                        lastDay=28;
                }
                else
                    lastDay=30;
                label=cellMap[this.state.bjtjColumnsId[this.state.月字段]]+".22-"+cellMap[this.state.bjtjColumnsId[this.state.月字段]]+"."+lastDay;
            }
        }
        //console.log("label==="+label)
        return label;
    }
    getBarOption =()=> {
        let option = {
            tooltip:{   //展示数据
                trigger:'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend:{
                itemWidth:10,
                itemHeight:10,
                x:'center',
                y: '15px',
                textStyle:{
                    fontSize:9
                },
                data:this.state.barLegendData
            },
            xAxis:{
                //data:['周一','周二','周三','周四','周五','周六','周日']
                data:this.state.xAxisData,
                axisTick:{alignWithLabel:this.state.alignWithLabel},
                axisLine:{
                    lineStyle:{
                        color:"#999",
                        width:0.5
                    }
                },
                axisLabel: {
                    fontSize:this.state.X轴字号,
                    interval:0
                    //rotate:45
                }
            },
            yAxis:{
                type:'value',
                minInterval: 1,
                axisLine:{
                    lineStyle:{
                        color:"#999",
                        width:0.5
                    }
                },
                axisLabel:{
                    fontSize:9
                },
                splitLine:{
                    lineStyle:{
                        color:"#ddd",
                        width:0.5
                    }
                }
            },
            series:this.state.series
                /*
                [
                {
                    name:'人员一键紧急报警',
                    type:'bar',
                    data:[1000,2000,1500,3000,2000,1200,800],
                    barGap:0
                },
                {
                    name:'车间缺员报警',
                    type:'bar',
                    data:[1000,2000,1500,3000,2000,1200,800],
                    barGap:0
                }
            ]
                 */
        }
        return option;
    }
    getZHBarOption =()=> {
        let option = {
            tooltip:{   //展示数据
                trigger:'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend:{
                itemWidth:10,
                itemHeight:10,
                x:'center',
                y: '15px',
                textStyle:{
                    fontSize:9
                },
                data:this.state.zhBarLegendData
            },
            xAxis:{
                data:this.state.zhxAxisData,
                axisTick:{alignWithLabel:this.state.zhAlignWithLabel},
                axisLine:{
                    lineStyle:{
                        color:"#999",
                        width:0.5
                    }
                },
                axisLabel: {
                    fontSize:this.state.综合X轴字号,
                    interval:0
                    //rotate:45
                }
            },
            yAxis:{
                type:'value',
                minInterval: 1,
                axisLine:{
                    lineStyle:{
                        color:"#999",
                        width:0.5
                    }
                },
                axisLabel:{
                    fontSize:9
                },
                splitLine:{
                    lineStyle:{
                        color:"#ddd",
                        width:0.5
                    }
                }
            },
            series:this.state.zhSeries
        }
        return option;
    }
    getPieOption=()=>{
        let option = {
            title: {
                text: '车间报警统计',
                //subtext: '虚构数据',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                //formatter: '{a} <br/>{b} : {c} ({d}%)<br/>aaaaaaa'
                formatter:function (json) {
                    console.log("json==="+JSON.stringify(json)+","+JSON.stringify(json["data"]["bjlxList"]))
                    let html="";
                    html+=json["data"]["name"].split("@R@")[1]+":"+json["data"]["value"]
                    let bjlxList=json["data"]["bjlxList"];
                    bjlxList.map((item,index)=>{
                        html+="<br/>"+item.name+":"+item.count
                    });
                    return html
                }
            },
            legend: {
                // orient: 'vertical',
                // top: 'middle',
                bottom: 10,
                left: 'center',
                data: this.state.pieLegendData,
                formatter:function(json){
                    return json.split("@R@")[1]
                }
            },
            series: [
                {
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '50%'],
                    label: {
                        position: 'inner',
                        formatter:
                            this.state.bjqyList.length<=4
                            ?
                            function(json){
                                return ""
                            }
                            :
                            function(json){
                                return json["data"]["name"]
                            }
                    },
                    //roseType : 'area',
                    selectedMode: 'single',
                    data:this.state.pieSeriesDataList,
                    /*
                    data: [
                        {value: 1548,name: '一车间',name1:'aaa', selected: true},
                        {value: 535, name: '二车间'},
                        {value: 510, name: '兖州', selected: true},
                        {value: 634, name: '益州'},
                        {value: 735, name: '西凉', selected: true}
                    ],
                    */
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            ]
        }
        return option;
    }
    getZHPieOption=()=>{
        let option = {
            title: {
                text: '车间报警统计',
                //subtext: '虚构数据',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                //formatter: '{a} <br/>{b} : {c} ({d}%)<br/>aaaaaaa'
                formatter:function (json) {
                    console.log("json==="+JSON.stringify(json)+","+JSON.stringify(json["data"]["bjlxList"]))
                    let html="";
                    html+=json["data"]["name"]+":"+json["data"]["value"]
                    let bjlxList=json["data"]["bjlxList"];
                    bjlxList.map((item,index)=>{
                        html+="<br/>"+item.name+":"+item.count
                    });
                    return html
                }
            },
            legend: {
                bottom: 10,
                left: 'center',
                data: this.state.zhPieLegendData
            },
            series: [
                {
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '50%'],
                    label: {
                        position: 'inner',
                        formatter:
                            this.state.bjqyList.length<=4
                                ?
                                function(json){
                                    return ""
                                }
                                :
                                function(json){
                                    return json["data"]["name"]
                                }
                    },
                    selectedMode: 'single',
                    data:this.state.zhPieSeriesDataList,
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            ]
        }
        return option;
    }
    showContentDiv=(flag)=>{
        if(flag=="zhbjtj"){
            $("#zhbjtj_but_div").css("color","#477A8F");
            $("#zhbjtj_but_div").css("border-bottom","#497DD0 solid 1px");
            $("#zhbjtj_content_div").css("display","block");

            $("#xxbjtj_but_div").css("color","#000");
            $("#xxbjtj_but_div").css("border-bottom","#fff solid 1px");
            $("#xxbjtj_content_div").css("display","none");
        }
        else{
            $("#zhbjtj_but_div").css("color","#000");
            $("#zhbjtj_but_div").css("border-bottom","#fff solid 1px");
            $("#zhbjtj_content_div").css("display","none");

            $("#xxbjtj_but_div").css("color","#477A8F");
            $("#xxbjtj_but_div").css("border-bottom","#497DD0 solid 1px");
            $("#xxbjtj_content_div").css("display","block");
        }
    }
    setDPDate=(flag,value)=>{
        if(flag=="start")
            this.state.barStartDate=moment(value).format('YYYY-MM-DD HH:mm:ss');
        else if(flag=="end")
            this.state.barEndDate=moment(value).format('YYYY-MM-DD HH:mm:ss');
    }
    getShowDate=(value)=>{
        let dateValue = moment(value).format("YYYY-MM");
        let tem = (
            <Text style={{fontSize:18}}>{dateValue}</Text>
        )
        return tem;
    }
    substringItemValue(value,index){
        if(value){
            return value.split("@R@")[index];
        }
        else
            return ""
    }
    goPage=(value)=>{
        this.props.history.push(`/${value}`);
    }

    render() {
        const {日查询常量,周查询常量,月查询常量,三个月查询常量,barLegendData,todayBjCountList}=this.state
        let {itemDiv}=this.state
        return <div className="dataTjPage_div">
            <div className="top_div">报警统计</div>
            <div className="back_but_div" onClick={this.goPage.bind(this,'home')}>&lt;返回</div>
            <div>
                <div className="jrbjtjsl_div">
                    <div className="jrbjsl_tit_div">今日报警</div>
                    <div className="count_list_div">
                        {
                            barLegendData.map((item,index)=>{
                                if(index%2==0){
                                    itemDiv=<div className="item_div" style={{marginTop:'0px',marginLeft:'0px'}}>
                                        <span className="text_span">{item}</span>
                                        <span className="count_span">{todayBjCountList[item]}</span>
                                    </div>
                                }
                                else{
                                    itemDiv=<div className="item_div" style={{marginTop:'-30px',marginLeft:'200px'}}>
                                            <div className="text_span">{item}</div>
                                            <div className="count_span">{todayBjCountList[item]}</div>
                                        </div>
                                }
                                return itemDiv
                            })
                        }
                        {/*<div className="item_div">*/}
                        {/*    <span className="text_span">人员长时间静止报警</span>*/}
                        {/*    <span className="count_span">33</span>*/}
                        {/*</div>*/}
                        {/*<div className="item_div" style={{marginTop:'-30px',marginLeft:'200px'}}>*/}
                        {/*    <div className="text_span">缺员报警</div>*/}
                        {/*    <div className="count_span">3</div>*/}
                        {/*</div>*/}
                        {/*<div className="item_div" style={{marginTop:'0px',marginLeft:'0px'}}>*/}
                        {/*    <div className="text_span">超员报警</div>*/}
                        {/*    <div className="count_span">3</div>*/}
                        {/*</div>*/}
                        {/*<div className="item_div" style={{marginTop:'-30px',marginLeft:'200px'}}>*/}
                        {/*    <div className="text_span">串岗报警</div>*/}
                        {/*    <div className="count_span">3</div>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div className="bar_search_type_div" id="bar_search_type_div">
                    <div className="but_div" id="but_div">
                        <div className="date_but_div" id="date_but_div" onClick={(e)=>this.initBarListByMenuId(日查询常量,true)}>日</div>
                        <div className="week_but_div" id="week_but_div" onClick={(e)=>this.initBarListByMenuId(周查询常量,true)}>周</div>
                        <div className="month_but_div" id="month_but_div" onClick={(e)=>this.initBarListByMenuId(月查询常量,true)}>月</div>
                    </div>
                </div>
                {/*<DatePicker*/}
                {/*    mode="date"*/}
                {/*    title="开始时间"*/}
                {/*    extra="开始时间"*/}
                {/*    value={this.state.date}*/}
                {/*    onChange={date => this.setDPDate('start',date)}*/}
                {/*>*/}
                {/*    <List.Item arrow="horizontal">2019-01-01</List.Item>*/}
                {/*</DatePicker>*/}
                {/*<DatePicker*/}
                {/*    mode="date"*/}
                {/*    title="结束时间"*/}
                {/*    extra="结束时间"*/}
                {/*    value={this.state.date}*/}
                {/*    onChange={date=>this.setDPDate('end',date)}*/}
                {/*>*/}
                {/*    <List.Item arrow="horizontal">2021-01-01</List.Item>*/}
                {/*</DatePicker>*/}
            </div>
            <div className="bar_div">
                <BarReactEcharts className="reactEcharts" id="echart" option={this.getBarOption()}/>
            </div>
            <div className="pie_search_type_div" id="pie_search_type_div">
                <div className="but_div" id="but_div">
                    <div className="date_but_div" id="date_but_div" onClick={(e)=>this.initPieListByMenuId(日查询常量,true)}>日</div>
                    <div className="week_but_div" id="week_but_div" onClick={(e)=>this.initPieListByMenuId(周查询常量,true)}>周</div>
                    <div className="month_but_div" id="month_but_div" onClick={(e)=>this.initPieListByMenuId(月查询常量,true)}>月</div>
                    <div className="three_month_but_div" id="three_month_but_div" onClick={(e)=>this.initPieListByMenuId(三个月查询常量,true)}>三个月</div>
                </div>
            </div>
            <div className="pie_div">
                <PieReactEcharts className="reactEcharts" id="echart" option={this.getPieOption()}/>
            </div>

            <div className="bjtj_tab_div">
                <div className="but_div" id="but_div">
                    <div className="zhbjtj_but_div" id="zhbjtj_but_div" onClick={(e)=>this.showContentDiv('zhbjtj')}>综合报警统计</div>
                    <div className="xxbjtj_but_div" id="xxbjtj_but_div" onClick={(e)=>this.showContentDiv('xxbjtj')}>详细报警统计</div>
                </div>
            </div>
            <div className="zhbjtj_content_div" id="zhbjtj_content_div">
                <div className="zhBar_search_type_div" id="zhBar_search_type_div">
                    <div className="but_div" id="but_div">
                        <div className="date_but_div" id="date_but_div" onClick={(e)=>this.initZHBarListByMenuId(日查询常量,true)}>日</div>
                        <div className="week_but_div" id="week_but_div" onClick={(e)=>this.initZHBarListByMenuId(周查询常量,true)}>周</div>
                        <div className="month_but_div" id="month_but_div" onClick={(e)=>this.initZHBarListByMenuId(月查询常量,true)}>月</div>
                    </div>
                </div>
                <div className="zhBar_div">
                    <BarReactEcharts className="reactEcharts" id="echart" option={this.getZHBarOption()}/>
                </div>
                <div className="zhPie_search_type_div" id="zhPie_search_type_div">
                    <div className="but_div" id="but_div">
                        <div className="date_but_div" id="date_but_div" onClick={(e)=>this.initZHPieListByMenuId(日查询常量,true)}>日</div>
                        <div className="week_but_div" id="week_but_div" onClick={(e)=>this.initZHPieListByMenuId(周查询常量,true)}>周</div>
                        <div className="month_but_div" id="month_but_div" onClick={(e)=>this.initZHPieListByMenuId(月查询常量,true)}>月</div>
                        <div className="three_month_but_div" id="three_month_but_div" onClick={(e)=>this.initZHPieListByMenuId(三个月查询常量,true)}>三个月</div>
                    </div>
                </div>
                <div className="zhPie_div">
                    <PieReactEcharts className="reactEcharts" id="echart" option={this.getZHPieOption()}/>
                </div>
            </div>

            <div className="xxbjtj_content_div" id="xxbjtj_content_div"></div>
        </div>;
    }
}

export default withRouter(DataTj)