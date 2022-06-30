// Distributed under Apache 2 License
// apost.kr
// version 1.0.0
// 2019-02-27

function initReservationForm(){

    //기본 체크로 켬
    if($('.comment-form #secret').length){
        //$('.comment-form #secret').attr('checked',true);
    }

    if(breserve_post){

        //예약 양식 생성
        $('#entry'+post_id+'Comment').addClass('reservation');

        if(breservation && !breserve_permitedit && !$('#ad_edit').length){
            $('#entry'+post_id+'Comment').addClass('hideeditdel');
        }            
    
        //손님이면
        if(bguest){
            $('#entry'+post_id+'Comment').addClass('guest');
        }

        if(breservation){
            
            //$('div.comment-form textarea').hide();//댓글 입력필드 감춤
            //$('div.comment-form .submit').hide();//댓글 입력필드 감춤
            //$('div.comment-form').hide();//댓글폼 감추기

            $('.comments form').prepend('<input type="hidden" name="regen" id="regen" value=""/>');

            //댓글 전체 외곽에 에약폼 추가
            $('#entry'+post_id+'Comment').after('<form name="rform" id="rform" onsubmit="return false;"><div id="reserve_form" class="reserve-form"></div></form>');//예약폼 테두리

            //필드 추가 - 타이틀 영역
            $('div.reserve-form').append('<h1>'+reserve_title_label+'</h1>');
            $('div.reserve-form').append('<div class="notice"><h3>'+ (bguest ? '[비로그인 '+reserve_title_label+'는 닉네임과 패스워드가 예약자명으로 저장됩니다.]':'') + (reserve_notice_label != '' ? '<br/>':'') + reserve_notice_label+'</h3></div>');

            //이름, 연락처
            if(breserve_name || breserve_tel){
                $('div.reserve-form').append('<div id="reserve_inner1" class="reserve-inner"></div>');
            }
            if(breserve_name){
                $('#reserve_inner1').append('<div><input type="text" name="reserve_name" id="reserve_name" size="20" maxlength="20" placeholder="'+reserve_name_label+'"/></div>');
            }
            if(breserve_tel){
                $('#reserve_inner1').append('<div><input type="text" name="reserve_tel" id="reserve_tel" size="13" maxlength="13" placeholder="'+reserve_tel_label+'"/></div>');
            }

            //예약일 시작, 끝
            if(breserve_startday){
                $('div.reserve-form').append('<div id="reserve_inner2" class="reserve-inner"></div>');
                $('#reserve_inner2').append('<div><input type="text" name="reserve_startday" class="reserve_day" id="reserve_startday" size="10" maxlength="10" value="'+reserve_startday_label+'" placeholder="'+reserve_startday_label+'" readonly /><div id="reserve_startdayview"></div></div>');
                if(breserve_hour){
                    var houroption = "";
                    for(var i=0;i<24;i++){houroption+='<option value="'+i+'" '+(i==0?"selected":"")+'>'+i+'시</option>';};
                    $('#reserve_inner2').append('<div><select name="reserve_startdayhour" class="reserve_hour" id="reserve_startdayhour">'+houroption+'</select></div>');
                    if(breserve_min){
                        var minoption = "";
                        for(var i=0;i<6;i++){minoption+='<option value="'+i*10+'" '+(i==0?"selected":"")+'>'+i*10+'분</option>';};
                        $('#reserve_inner2').append('<div><select name="reserve_startdaymin" class="reserve_min" id="reserve_startdaymin">'+minoption+'</select></div>');
                    }
                }
            }

            if(breserve_endday){
                $('div.reserve-form').append('<div id="reserve_inner3" class="reserve-inner"></div>');
                $('#reserve_inner3').append('<div><input type="text" name="reserve_endday" id="reserve_endday" class="reserve_day" size="10" maxlength="10" value="'+reserve_endday_label+'" placeholder="'+reserve_endday_label+'" readonly /><div id="reserve_enddayview"></div></div>');
                if(breserve_hour){
                    var houroption = "";
                    for(var i=0;i<24;i++){houroption+='<option value="'+i+'" '+(i==0?"selected":"")+'>'+i+'시</option>';};
                    $('#reserve_inner3').append('<div><select name="reserve_enddayhour" class="reserve_hour" id="reserve_enddayhour">'+houroption+'</select></div>');
                    if(breserve_min){
                        var minoption = "";
                        for(var i=0;i<6;i++){minoption+='<option value="'+i*10+'" '+(i==0?"selected":"")+'>'+i*10+'분</option>';};
                        $('#reserve_inner3').append('<div><select name="reserve_enddaymin" class="reserve_min" id="reserve_enddaymin">'+minoption+'</select></div>');
                    }
                }
            }

            //옵션1,2,3
            if(breserve_option1 || breserve_option2 || breserve_option3){
                $('div.reserve-form').append('<div id="reserve_inner4" class="reserve-inner"></div>');
            }				
            if(breserve_option1){
                var reserve_option1_options = "";
                for(var i=0;i<reserve_option1_val.length;i++){reserve_option1_options+=reserve_option1_val[i] != ''?'<option value="'+reserve_option1_val[i]+'">'+reserve_option1_val[i]+'</option>':"";};
                $('#reserve_inner4').append('<div><select name="reserve_option1" id="reserve_option1"><option value="">'+reserve_option1_label+'</option>'+reserve_option1_options+'</select></div>');
            }
            if(breserve_option2){
                var reserve_option2_options = "";
                for(var i=0;i<reserve_option2_val.length;i++){reserve_option2_options+=reserve_option2_val[i] != ''?'<option value="'+reserve_option2_val[i]+'">'+reserve_option2_val[i]+'</option>':"";};
                $('#reserve_inner4').append('<div><select name="reserve_option2" id="reserve_option2"><option value="">'+reserve_option2_label+'</option>'+reserve_option2_options+'</select></div>');
            }
            if(breserve_option3){
                var reserve_option3_options = "";
                for(var i=0;i<reserve_option3_val.length;i++){reserve_option3_options+=reserve_option3_val[i] != ''?'<option value="'+reserve_option3_val[i]+'">'+reserve_option3_val[i]+'</option>':"";};
                $('#reserve_inner4').append('<div><select name="reserve_option3" id="reserve_option3"><option value="">'+reserve_option3_label+'</option>'+reserve_option3_options+'</select></div>');
            }
            if(breserve_comment){
                $('div.reserve-form').append('<div><textarea name="reserve_comment" id="reserve_comment" placeholder="메모" rows="4" cols="80"></textarea></div>');
            }

            //커맨드라인
            $('div.reserve-form').append('<div id="reserve_inner5" class="reserve-inner cmd"></div>');

            //저장버튼
            $('#reserve_inner5').append('<div><button class="submit" name="comment" id="reserve_save">저장</button></div>');

            //비로그인 조건 처리
            if(bguest){
                $('div.comment-form textarea').addClass("guest");
            }
            
            if(kakao_qrimage != ''){
                $('#reserve_inner5').append('<div><a type="button" class="submit" data-url="'+kakao_qrimage+'?download" data-lightbox="lightbox" name="reserve_qrimage" id="reserve_qrimage">카카오송금 QR코드 보기</a></div>');
            }

            //클리어 라인
            $('div.reserve-form').append('<div class="clear"></div>');

            //저장 버튼 클릭 이벤트
            if($('#reserve_save').length){
                $('#reserve_save').click(function(){
                    //내용 작성
                    var ret = composeReservationForm();

                    //저장
                    if(ret){
                        //이름 변경
                        $('div.comment-form textarea').attr("name","comment");
                        $('div.comment-form button').attr("name","");
                        if(typeof needCommentCaptcha !== 'undefined' && needCommentCaptcha && !$('#imageCaptcha').length){
                            return false;
                        }else{
                            $('.comment-form button').trigger('click');
                        }
                    }
                });
            }

            /*
            //수정 미사용
            if($('#reserve_edit').length){
                $('#reserve_edit').click(function(){
                    //내용 작성
                    parseReservationData();
                });
            }
            */

            //캘린더 생성
            if(breserve_startday || breserve_endday){
                var now = new Date();
                var year = now.getFullYear();
                var month = now.getMonth() + 1;
                var date = now.getDate();

                var data = [{date: year + '-' + month + '-' + (date), value: '오늘'}];
                
                if(breserve_startday){
                    $('#reserve_startdayview').calendar({
                        trigger: '#reserve_startday',
                        // offset: [0, 1],
                        zIndex: 999,
                        data: data
                    });        
                }
                if(breserve_endday){
                    $('#reserve_enddayview').calendar({
                        trigger: '#reserve_endday',
                        // offset: [0, 1],
                        zIndex: 999,
                        data: data
                    });       
                }
            } //breserve_startday || breserve_endday
            
        }//breservation

    }//post_id > 0 
}

//폼 초기화
function resetReservationForm(){
    $('#reserve_name').val('');
    $('#reserve_tel').val('');

    if($('#reserve_startday').length){$('#reserve_startday').val('');}
    if($('#reserve_startdayhour').length){$('#reserve_startdayhour').val('0');}
    if($('#reserve_startdaymin').length){$('#reserve_startdaymin').val('0');}

    if($('#reserve_endday').length){$('#reserve_endday').val('');}
    if($('#reserve_enddayhour').length){$('#reserve_enddayhour').val('0');}
    if($('#reserve_enddaymin').length){$('#reserve_enddaymin').val('0');}

    if($('#reserve_option1').length){$('#reserve_option1').val('');}
    if($('#reserve_option2').length){$('#reserve_option2').val('');}
    if($('#reserve_option3').length){$('#reserve_option3').val('');}
    $('#reserve_comment').val('');
}

//예약 정보 수정
/*
function parseReservationData(){
    var rdata = $('.comment-form textarea[name=comment]').val();
    if(rdata != ""){
        
        var arr_rdata = rdata.split('\n');

        if(arr_rdata.length == 8){
            if(arr_rdata[0] != ""){
                var val = arr_rdata[0].split(':');
                if(val.length == 2){
                    $('#reserve_name').val(val[1]);
                }
            }
            if(arr_rdata[1] != ""){
                var val = arr_rdata[1].split(':');
                if(val.length == 2){
                    $('#reserve_tel').val(val[1]);
                }
            }
            if(arr_rdata[2] != ""){
                var val = arr_rdata[2].split(':');
                if(val.length == 2){
                    var dhm = val[1].split(' ');
                    if(dhm.length > 0){
                        $('#reserve_startday').val(dhm[0]);
                        if(dhm.length > 1){$('#reserve_startdayhour').val(dhm[1].replace('시',''))};
                        if(dhm.length > 2){$('#reserve_startdaymin').val(dhm[2].replace('분',''))};
                    }
                }
            }
            if(arr_rdata[3] != ""){
                var val = arr_rdata[3].split(':');
                if(val.length == 2){
                    var dhm = val[1].split(' ');
                    if(dhm.length > 0){
                        $('#reserve_endday').val(dhm[0]);
                        if(dhm.length > 1){$('#reserve_enddayhour').val(dhm[1].replace('시',''))};
                        if(dhm.length > 2){$('#reserve_enddaymin').val(dhm[2].replace('분',''))};
                    }
                }
            }
            if(arr_rdata[4] != ""){
                var val = arr_rdata[4].split(':');
                if(val.length == 2){
                    $('#reserve_option1').val(val[1]);
                }                    
            }
            if(arr_rdata[5] != ""){
                var val = arr_rdata[5].split(':');
                if(val.length == 2){
                    $('#reserve_option2').val(val[1]);
                }                    
            }
            if(arr_rdata[6] != ""){
                var val = arr_rdata[6].split(':');
                if(val.length == 2){
                    $('#reserve_option3').val(val[1]);
                }                      
            }
            if(arr_rdata[7] != ""){$('#reserve_comment').val(arr_rdata[7].replace('&#58;',':'));}
        }
    }
}
*/

//내용 작성
function composeReservationForm(){
    var composeData = "";
    if($('#reserve_name').length){
        if($('#reserve_name').val() == ""){
            alert(reserve_name_label+"을 입력해 주십시오.");
            $('#reserve_name').focus();
            return false;
        }else{
            composeData += reserve_name_label+"이름:"+$('#reserve_name').val();
        }
    }
    composeData += "\n";
    if($('#reserve_tel').length){
        if($('#reserve_tel').val() == ""){
            alert(reserve_tel_label+"를 입력해 주십시오.");
            $('#reserve_tel').focus();
            return false;
        }else{
            composeData += reserve_name_label+":"+$('#reserve_tel').val();
        }
    }
    composeData += "\n";
    if($('#reserve_startday').length){
        if($('#reserve_startday').val() == "" || $('#reserve_startday').val() == reserve_startday_label){
            alert(reserve_startday_label+"을 선택해 주십시오.");
            $('#reserve_startday').focus();
            return false;
        }else{
            composeData += reserve_startday_label+":"+$('#reserve_startday').val();
            if($('#reserve_startdayhour').length){
                composeData += (breserve_hour ? " "+$('#reserve_startdayhour').val()+"시":"");
                if($('#reserve_startdaymin').length){
                    composeData += (breserve_min ? " "+$('#reserve_startdaymin').val()+"분":"");
                }
            }
        }
    }
    composeData += "\n";
    if($('#reserve_endday').length){
        if($('#reserve_endday').val() == "" || $('#reserve_endday').val() == reserve_endday_label){
            alert(reserve_endday_label+"을 선택해 주십시오.");
            $('#reserve_endday').focus();
            return false;
        }else{
            composeData += reserve_endday_label+":"+$('#reserve_endday').val();
            if($('#reserve_enddayhour').length){
                composeData += (breserve_hour ? " "+$('#reserve_enddayhour').val()+"시":"");
                if($('#reserve_enddaymin').length){
                    composeData += (breserve_min ? " "+$('#reserve_enddaymin').val()+"분":"");
                }
            }
        }
    }
    composeData += "\n";
    if($('#reserve_option1').length){
        if($('#reserve_option1').val() == "" && $('#reserve_option1 option').length > 1){
            alert(reserve_option1_label+"을 선택해 주십시오.");
            $('#reserve_option1').focus();
            return false;
        }else{
            composeData += reserve_option1_label+":"+$('#reserve_option1').val();
        }
    }
    composeData += "\n";
    if($('#reserve_option2').length){
        if($('#reserve_option2').val() == "" && $('#reserve_option2 option').length > 1){
            alert(reserve_option2_label+"를 선택해 주십시오.");
            $('#reserve_option2').focus();
            return false;
        }else{
            composeData += reserve_option2_label+":"+$('#reserve_option2').val();
        }
    }
    composeData += "\n";
    if($('#reserve_option3').length){
        if($('#reserve_option3').val() == "" && $('#reserve_option3 option').length > 1){
            alert(reserve_option3_label+"을 선택해 주십시오.");
            $('#reserve_option3').focus();
            return false;
        }else{
            composeData += reserve_option3_label+":"+$('#reserve_option3').val();
        }
    }
    composeData += "\n";
    if($('#reserve_comment').length){
        if($('#reserve_comment').val() == "" && bcommentforce){
            alert("메모를 입력해 주십시오.");
            $('#reserve_comment').focus();
            return false;
        }else{
            composeData += $('#reserve_comment').val().replace(':','&#58;');
        }
    }
            
    //비밀글 강제
    if($('.comment-form #secret').length && bsecretforce){
        $('.comment-form #secret').attr('checked',true);
    }
    //이름, 패스워드 예약자명 자동 입력
    if(bguest && $('.comment-form input[name="password"]').length){
        $('.comment-form input[name="name"]').val($('#reserve_name').val());
        $('.comment-form input[name="password"]').val($('#reserve_name').val());
    }

    //내용에 예약 정보 삽입
    if(composeData != ''){
        $('.comment-form textarea').val(composeData);
        return true;
    }
}

function resetFieldName(){
    $('div.comment-form textarea').attr("name","comment");
    $('div.comment-form button').attr("name","submit");
    return;    
}