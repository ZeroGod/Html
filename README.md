<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>tab切换</title>
    <meta name="keywords" content="" />
    <meta name="Description" content="" />
    <style type="text/css">
        ul, li, div {
            padding: 0;
            margin: 0;
        }

            ul li {
                float: left;
                width: 100px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                background-color: #fff;
                border: 1px #bbb solid;
                border-bottom: none;
            }

                ul li.fli {
                    background-color: #ccc;
                    color: red;
                }

        ul {
            overflow: hidden;
            zoom: 1;
            list-style-type: none;
        }

        #tab_con {
            width: 304px;
            height: 200px;
        }

            #tab_con div {
                width: 304px;
                height: 200px;
                display: none;
                border: 1px #bbb solid;
                border-top: none;
            }

                #tab_con div.fdiv {
                    display: block;
                    background-color: #ccc;
                }
    </style>
</head>
<body>
    <ul id="tab">
        <li class="fli">tab1</li>
        <li>tab2</li>
        <li>tab3</li>
    </ul>
    <div id="tab_con">
        <div class="fdiv">aaaa</div>
        <div>bbbb</div>
        <div>cccc</div>
    </div>
    <script type="text/javascript">
        var tabs = document.getElementById("tab").getElementsByTagName("li");
        var divs = document.getElementById("tab_con").getElementsByTagName("div");
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].onmouseover = function () { change(this); }
        }

        function change(obj) {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i] == obj) {
                    tabs[i].className = "fli";
                    divs[i].className = "fdiv";
                }

                else {
                    tabs[i].className = "";
                    divs[i].className = "";
                }
            }
        }
    </script>
</body>
</html>
