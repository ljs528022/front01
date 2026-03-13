// 변수

window.onload = () => {
    const portals = document.querySelectorAll(".each-menu");
    const pages = document.querySelectorAll(".page");

    const memberTbody = document.querySelector("#memberTbody");
    const newsTbody = document.querySelector("#newsTbody");
    const postTbody = document.querySelector("#postTbody");
    const reportMemberTbody = document.querySelector("#reportMemberTbody");
    const reportPostTbody = document.querySelector("#reportPostTbody");
    const modalMemberDetail = document.querySelector("#modalMemberDetail");
    const modalNewsDetail = document.querySelector("#modalNewsDetail");
    const modalPostEdit = document.querySelector("#modalPostEdit");
    const modalReportDetail = document.querySelector("#modalReportDetail");

    const newsWriteBtn = document.querySelector("#newsWriteBtn");
    const newsCancelBtn = document.querySelector("#newsCancelBtn");
    const newsSubmitBtn = document.querySelector("#newsSubmitBtn");
    const aiBtn = document.querySelector("#aiBtn");

    const filterMemberGrade  = document.querySelector("#filterMemberGrade");
    const filterMemberStatus = document.querySelector("#filterMemberStatus");

    const filterPostType     = document.querySelector("#filterPostType");
    const filterPostCategory = document.querySelector("#filterPostCategory");

    const filterNewsCategory = document.querySelector("#filterNewsCategory");
    const newsHideBtn   = document.querySelector("#newsHideBtn");
    const newsShowBtn   = document.querySelector("#newsShowBtn");
    const newsDeleteBtn = document.querySelector("#newsDeleteBtn");

    const filterReportMember = document.querySelector("#filterReportMember");
    const filterReportPost = document.querySelector("#filterReportPost");

    const reportMemberDoneBtn   = document.querySelector("#reportMemberDoneBtn");
    const reportMemberRejectBtn = document.querySelector("#reportMemberRejectBtn");
    const reportMemberDeleteBtn = document.querySelector("#reportMemberDeleteBtn");

    const reportPostDoneBtn   = document.querySelector("#reportPostDoneBtn");
    const reportPostRejectBtn = document.querySelector("#reportPostRejectBtn");
    const reportPostDeleteBtn = document.querySelector("#reportPostDeleteBtn");

    const memberTypeSelect = document.querySelector("#memberTypeSelect");

    let postOriginal = {};
    let newsOriginal = {};

    const previewTitle    = document.querySelector("#previewTitle");
    const previewCategory = document.querySelector("#previewCategory");
    const previewContent  = document.querySelector("#previewContent");
    const previewSource   = document.querySelector("#previewSource");
    const previewDate     = document.querySelector("#previewDate");

    const modalImageViewer = document.querySelector("#modalImageViewer");
    const modalVideoViewer = document.querySelector("#modalVideoViewer");
    const modalNewsAutoSettings = document.querySelector("#modalNewsAutoSettings");
    const newsSettingsBtn = document.querySelector("#newsSettingsBtn");


    function getCheckedRows(tbody) {
        const trs = tbody.querySelectorAll(".div-tr");
        const result = [];
        for (let i = 0; i < trs.length; i++) {
            if (trs[i].querySelector("input[type='checkbox']").checked) {
                result.push(trs[i]);
            }
        }
        return result;
    }

    const badgeToStatus = (badge) => {
        switch (badge) {
            case "badge-pending": 
                return "pending";
            case "badge-done":    
                return "done";
            case "badge-reject":  
                return "rejected";
        }
    };


    // 게시물 첨부파일 더미데이터 (이미지 최대4 / 영상 최대1 / 없음)
    const postDummyAttach = [
        { type: "image", srcs: ["../../static/images/admin/file-ex.PNG", "../../static/images/admin/file-ex.PNG", "../../static/images/admin/file-ex.PNG"] },
        { type: "video", src: "../../static/video/Video-Project-2.mp4" },
        { type: "image", srcs: ["../../static/images/admin/file-ex.PNG", "../../static/images/admin/file-ex.PNG", "../../static/images/admin/file-ex.PNG", "../../static/images/admin/file-ex.PNG"] },
        { type: "none" },
        { type: "image", srcs: ["../../static/images/admin/file-ex.PNG"] },
        { type: "video", src: "../../static/video/Video-Project-2.mp4" },
        { type: "image", srcs: ["../../static/images/admin/file-ex.PNG", "../../static/images/admin/file-ex.PNG"] },
    ];

    // 뉴스 더미데이터
    const aiNews = {
        title:   "[속보] 코스피 8% 폭락…3거래일 만에 서킷브레이커 발동",
        summary: "유가증권시장에 서킷브레이커가 발동됐다고 공시했다. 당시 코스피 지수는 전 거래일보다 8.1% 하락한 5132.07이었다.이란 사태 장기화 가능성이 부각되면서 특히 반도체주가 급락 중이다. 유가 상승은 달러 수요를 늘리는 ‘페트로달러’ 효과를 통해 원화값 하락(환율 상승) 압력으로 이어질 수 있다. 이날 원·달러 환율은 급등하며 1500원 선을 위협하고 있다. 오전 10시 45분 현재 달러에 대한 원화가치는 전 거래일보다 12원(0.81%) 내린(환율 상승) 1497.00원을 나타내고 있다.",
        source:  "JoongAng News"
    };


    // 1. 사이드바 메뉴 눌렀을때 탭 전환
    portals.forEach((portal, i) => {
        portal.addEventListener("click", (e) => {

            pages.forEach((page) => {
                page.classList.remove("active");
            });

            portals.forEach((eachPortal) => {
                eachPortal.classList.remove("active");
            });

            e.target.classList.add("active");
            pages[i].classList.add("active");
        });
    });


    // 2. 뉴스 목록에서 뉴스 등록 버튼 눌렀을때 (portals[3] = 뉴스 등록)
    newsWriteBtn.addEventListener("click", (e) => {

        pages.forEach((page) => {
            page.classList.remove("active");
        });

        portals.forEach((eachPortal) => {
            eachPortal.classList.remove("active");
        });

        portals[3].classList.add("active");
        pages[3].classList.add("active");
    });


    // 3. 뉴스 등록 취소 눌렀을때 (portals[2] = 뉴스 목록임.)
    newsCancelBtn.addEventListener("click", (e) => {

        pages.forEach((page) => {
            page.classList.remove("active");
        });

        portals.forEach((eachPortal) => {
            eachPortal.classList.remove("active");
        });

        portals[2].classList.add("active");
        pages[2].classList.add("active");
    });


    // 4. 뉴스 전체선택 체크박스
    document.querySelector("#newsCheckAll").addEventListener("change", (e) => {
        newsTbody.querySelectorAll("input[type='checkbox']").forEach((cb) => {
            cb.checked = e.target.checked;
        });
    });

    // 4-1. 뉴스 비활성화 버튼
    newsHideBtn.addEventListener("click", (e) => {
        const checked = getCheckedRows(newsTbody);
        if (!checked.length) { alert("선택된 뉴스가 없습니다."); return; }
        if (!confirm(`선택한 ${checked.length}개 뉴스를 숨기시겠습니까?`)) return;
        checked.forEach(tr => tr.classList.add("row-hidden"));
    });

    // 4-2. 뉴스 보이기 버튼
    newsShowBtn.addEventListener("click", (e) => {
        const checked = getCheckedRows(newsTbody);
        if (!checked.length) { alert("선택된 뉴스가 없습니다."); return; }
        if (!confirm(`선택한 ${checked.length}개 뉴스를 다시 표시하시겠습니까?`)) return;
        checked.forEach(tr => tr.classList.remove("row-hidden"));
    });

    // 4-3. 뉴스 삭제 버튼
    newsDeleteBtn.addEventListener("click", (e) => {
        const checked = getCheckedRows(newsTbody);
        if (!checked.length) { alert("선택된 뉴스가 없습니다."); return; }
        if (!confirm(`선택한 ${checked.length}개 뉴스를 삭제하시겠습니까?`)) return;
        checked.forEach(tr => tr.remove());
    });

    // 4-4. 뉴스 카테고리 필터
    const applyNewsFilter = () => {
        const categoryVal = filterNewsCategory.value;
        newsTbody.querySelectorAll(".div-tr").forEach((tr) => {
            const tds     = tr.querySelectorAll(".div-td");
            const category = tds[4].textContent.trim();
            if (categoryVal === "all" || category === categoryVal) {
                tr.classList.remove("off");
            } else {
                tr.classList.add("off");
            }
        });
    };
    filterNewsCategory.addEventListener("change", applyNewsFilter);

    // 4-5. 뉴스 행 클릭 → 수정 모달 열기
    // 컬럼: 선택(0)-번호(1)-출처(2)-제목(3)-카테고리(4)-조회수(5)-작성일(6)
    newsTbody.addEventListener("click", (e) => {
        if (e.target.type === "checkbox") return;

        const tr = e.target.closest(".div-tr");
        if (!tr) return;
        const tds = tr.querySelectorAll(".div-td");

        document.querySelector("#newsDetailTitle").value    = tds[3].textContent;
        document.querySelector("#newsDetailSource").value   = tds[2].textContent;
        document.querySelector("#newsDetailCategory").value = tds[4].textContent;
        document.querySelector("#newsDetailContent").value  = aiNews.summary;

        newsOriginal = {
            title:    tds[3].textContent,
            source:   tds[2].textContent,
            category: tds[4].textContent,
            content:  aiNews.summary
        };

        document.querySelector("#modalNewsSave").disabled = true;
        modalNewsDetail.classList.remove("off");
    });

    // 4-3. 뉴스 수정 모달 닫기
    document.querySelector("#modalNewsClose").addEventListener("click", (e) => {
        modalNewsDetail.classList.add("off");
    });

    document.querySelector("#modalNewsCancel").addEventListener("click", (e) => {
        modalNewsDetail.classList.add("off");
    });

    modalNewsDetail.addEventListener("click", (e) => {
        if (e.target === modalNewsDetail) {
            modalNewsDetail.classList.add("off");
        }
    });

    // 4-4. 뉴스 수정 저장
    document.querySelector("#modalNewsSave").addEventListener("click", (e) => {
        let result = confirm("수정한 내용을 저장하시겠습니까?");

        if (result) {
            alert("저장되었습니다.");
            modalNewsDetail.classList.add("off");
        }
    });

    // 4-5. 뉴스 모달 변경값 있을시에 수정 버튼 활성화
    const checkNewsChanged = () => {
        const changed =
            document.querySelector("#newsDetailTitle").value    !== newsOriginal.title    ||
            document.querySelector("#newsDetailSource").value   !== newsOriginal.source   ||
            document.querySelector("#newsDetailCategory").value !== newsOriginal.category ||
            document.querySelector("#newsDetailContent").value  !== newsOriginal.content;
        document.querySelector("#modalNewsSave").disabled = !changed;
    };
    document.querySelector("#newsDetailTitle").addEventListener("input", checkNewsChanged);
    document.querySelector("#newsDetailSource").addEventListener("input", checkNewsChanged);
    document.querySelector("#newsDetailCategory").addEventListener("change", checkNewsChanged);
    document.querySelector("#newsDetailContent").addEventListener("input", checkNewsChanged);


    // 5. 회원 목록 행 눌렀을때 상세 모달 열기
    memberTbody.querySelectorAll(".div-tr").forEach((tr) => {
        tr.addEventListener("click", (e) => {
            document.querySelector("#name").textContent     = "김민중";
            document.querySelector("#age").textContent      = "29";
            document.querySelector("#email").textContent    = "sokkomann@gmail.com";
            document.querySelector("#phone").textContent    = "010-1234-5678";
            document.querySelector("#company").textContent  = "GlobalGates";
            document.querySelector("#joinDate").textContent = "2025-01-15";
            document.querySelector("#statusSelect").value   = "active";
            memberTypeSelect.textContent                    = "free";

            modalMemberDetail.classList.remove("off");
        });
    });

    // 4-2. 회원 상세 모달 닫기
    document.querySelector("#modalMemberClose").addEventListener("click", (e) => {
        modalMemberDetail.classList.add("off");
    });

    document.querySelector("#modalMemberCancel").addEventListener("click", (e) => {
        modalMemberDetail.classList.add("off");
    });

    modalMemberDetail.addEventListener("click", (e) => {
        if (e.target === modalMemberDetail) {
            modalMemberDetail.classList.add("off");
        }
    });

    // 4-3. 회원 상세 모달 저장
    document.querySelector("#modalMemberSave").addEventListener("click", (e) => {
        let result = confirm("수정한 내용을 저장하시겠습니까?");

        if (result) {
            alert("저장되었습니다.");
            modalMemberDetail.classList.add("off");
        }
    });


    // 회원 필터 공통 함수
    // 컬럼: 번호(0)-이름(1)-이메일(2)-회사(3)-회원등급(4)-상태(5)-가입일(6)
    const applyMemberFilter = () => {
        const typeVal   = filterMemberGrade.value;
        const statusVal = filterMemberStatus.value;

        memberTbody.querySelectorAll(".div-tr").forEach((tr) => {
            const tds        = tr.querySelectorAll(".div-td");
            const memberType = tds[4].querySelector(".badge") ? tds[4].querySelector(".badge").textContent.trim() : "";
            const status     = tds[5].querySelector(".badge") ? tds[5].querySelector(".badge").textContent.trim() : "";

            const typeMatch   = typeVal   === "all" || memberType === typeVal;
            const statusMatch = statusVal === "all" || status     === statusVal;

            if (typeMatch && statusMatch) {
                tr.classList.remove("off");
            } else {
                tr.classList.add("off");
            }
        });
    };

    filterMemberGrade.addEventListener("change", applyMemberFilter);
    filterMemberStatus.addEventListener("change", applyMemberFilter);

    // 감추기 버튼
    document.querySelector("#postHideBtn").addEventListener("click", (e) => {
        const checked = getCheckedRows(postTbody);
        if (!checked.length) { alert("선택된 게시물이 없습니다."); return; }
        if (!confirm(`선택한 ${checked.length}개 게시물을 숨기시겠습니까?`)) return;
        checked.forEach(tr => tr.classList.add("row-hidden"));
    });

    // 보이기 버튼
    document.querySelector("#postShowBtn").addEventListener("click", (e) => {
        const checked = getCheckedRows(postTbody);
        if (!checked.length) { alert("선택된 게시물이 없습니다."); return; }
        if (!confirm(`선택한 ${checked.length}개 게시물을 다시 표시하시겠습니까?`)) return;
        checked.forEach(tr => tr.classList.remove("row-hidden"));
    });

    // 삭제 버튼
    document.querySelector("#postDeleteBtn").addEventListener("click", (e) => {
        const checked = getCheckedRows(postTbody);
        if (!checked.length) { alert("선택된 게시물이 없습니다."); return; }
        if (!confirm(`선택한 ${checked.length}개 게시물을 삭제하시겠습니까?`)) return;
        checked.forEach(tr => tr.remove());
    });

    // 5-0. 게시물 필터 공통 함수
    const applyPostFilter = () => {
        const typeVal     = filterPostType.value;
        const categoryVal = filterPostCategory.value;

        postTbody.querySelectorAll(".div-tr").forEach((tr) => {
            const tds       = tr.querySelectorAll(".div-td");
            const type      = tds[4].querySelector(".badge") ? tds[4].querySelector(".badge").textContent.trim() : "";
            const category  = tds[5].textContent.trim();

            const typeMatch     = typeVal === "all"     || type === typeVal;
            const categoryMatch = categoryVal === "all" || category === categoryVal;

            if (typeMatch && categoryMatch) {
                tr.classList.remove("off");
            } else {
                tr.classList.add("off");
            }
        });
    };

    filterPostType.addEventListener("change", applyPostFilter);
    filterPostCategory.addEventListener("change", applyPostFilter);

    // 5. 게시물 전체선택 체크박스
    document.querySelector("#checkAll").addEventListener("change", (e) => {
        postTbody.querySelectorAll("input[type='checkbox']").forEach((cb) => {
            cb.checked = e.target.checked;
        });
    });

    // 5. 게시물 행 클릭 → 수정 모달 열기
    postTbody.addEventListener("click", (e) => {
        if (e.target.type === "checkbox") return;

        // 5-3. 행 클릭 → 수정 모달 열기
        const tr = e.target.closest(".div-tr");
        if (!tr) return;
        const tds = tr.querySelectorAll(".div-td");

        // 컬럼: 선택(0)-번호(1)-작성자(2)-제목(3)-글종류(4)-물품종류(5)-작성일(6)
        document.querySelector("#peAuthor").textContent  = tds[2].textContent;
        document.querySelector("#peTitle").textContent   = tds[3].textContent;
        document.querySelector("#peContent").textContent = "안녕하세요. 철강 원자재 수입 관련하여 파트너 업체를 찾고 있습니다.안녕하세요. 철강 원자재 수입 관련하여 파트너 업체를 찾고 있습니다.";
        document.querySelector("#peType").value          = tds[4].querySelector(".badge").textContent.trim();
        document.querySelector("#peCategory").value      = tds[5].textContent;
        document.querySelector("#peDate").textContent    = tds[6].textContent;

        postOriginal = {
            type:     document.querySelector("#peType").value,
            category: document.querySelector("#peCategory").value
        };

        // 첨부파일 렌더링
        const trsAll = postTbody.querySelectorAll(".div-tr");
        let rowIdx = 0;
        for (let i = 0; i < trsAll.length; i++) {
            if (trsAll[i] === tr) { rowIdx = i; break; }
        }
        const attach = postDummyAttach[rowIdx % postDummyAttach.length];
        const postAttachImages = document.querySelector("#postAttachImages");
        const postAttachVideo  = document.querySelector("#postAttachVideo");
        const postAttachNone   = document.querySelector("#postAttachNone");

        postAttachImages.innerHTML = "";
        postAttachImages.classList.add("off");
        postAttachVideo.classList.add("off");
        postAttachNone.classList.add("off");

        if (attach.type === "image") {
            attach.srcs.forEach((src) => {
                const img = document.createElement("img");
                img.src = src;
                img.className = "report-attach-thumb";
                img.alt = "첨부 이미지";
                postAttachImages.appendChild(img);
            });
            postAttachImages.classList.remove("off");
        } else if (attach.type === "video") {
            document.querySelector("#videoViewerVideo").src = attach.src;
            postAttachVideo.classList.remove("off");
        } else {
            postAttachNone.classList.remove("off");
        }

        document.querySelector("#modalPostSave").disabled = true;
        modalPostEdit.classList.remove("off");
    });

    // 5-3. 게시물 수정 모달 닫기
    document.querySelector("#modalPostClose").addEventListener("click", (e) => {
        modalPostEdit.classList.add("off");
    });

    document.querySelector("#modalPostCancel").addEventListener("click", (e) => {
        modalPostEdit.classList.add("off");
    });

    modalPostEdit.addEventListener("click", (e) => {
        if (e.target === modalPostEdit) {
            modalPostEdit.classList.add("off");
        }
    });

    // 5-4. 게시물 수정 저장
    document.querySelector("#modalPostSave").addEventListener("click", (e) => {
        let result = confirm("수정한 내용을 저장하시겠습니까?");

        if (result) {
            alert("저장되었습니다.");
            modalPostEdit.classList.add("off");
        }
    });

    // 5-5. 게시물 모달 변경 감지 → 수정 버튼 활성화
    const checkPostChanged = () => {
        const changed =
            document.querySelector("#peType").value     !== postOriginal.type     ||
            document.querySelector("#peCategory").value !== postOriginal.category;
        document.querySelector("#modalPostSave").disabled = !changed;
    };
    document.querySelector("#peType").addEventListener("change", checkPostChanged);
    document.querySelector("#peCategory").addEventListener("change", checkPostChanged);


    // 6. AI 요약 버튼 눌렀을때
    aiBtn.addEventListener("click", (e) => {
        const url = document.querySelector("#newsUrl").value.trim();
        if (!url) {
            alert("뉴스 원문 URL을 입력해주세요.");
            return;
        }

        const aiBox    = document.querySelector("#aiBox");

        document.querySelector("#newsTitle").value              = aiNews.title;
        document.querySelector("#newsContent").value            = aiNews.summary;
        document.querySelector("#newsSource").value             = url;
        document.querySelector("#aiSummaryPreview").textContent = aiNews.summary;

        previewTitle.textContent   = aiNews.title;
        previewContent.textContent = aiNews.summary;
        previewSource.textContent  = aiNews.source;

        aiBox.classList.add("show");
        aiBtn.textContent = "AI 재요약";
    });


    // 7. 뉴스 등록 버튼 눌렀을때
    newsSubmitBtn.addEventListener("click", (e) => {
        const title   = document.querySelector("#newsTitle").value.trim();
        const content = document.querySelector("#newsContent").value.trim();
        if (!title || !content) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        let result = confirm("뉴스를 등록하시겠습니까?");
        if (!result) return;

        alert("뉴스가 등록되었습니다.");

        document.querySelector("#newsUrl").value              = "";
        document.querySelector("#newsTitle").value            = "";
        document.querySelector("#newsContent").value          = "";
        document.querySelector("#newsSource").value           = "";
        document.querySelector("#aiSummaryPreview").textContent = "";
        document.querySelector("#aiBox").classList.remove("show");
        aiBtn.textContent = "AI 요약 적용";

        pages.forEach((page) => {
            page.classList.remove("active");
        });
        portals.forEach((eachPortal) => {
            eachPortal.classList.remove("active");
        });
        portals[2].classList.add("active");
        pages[2].classList.add("active");
    });


    // 8. 회원 신고 전체선택
    document.querySelector("#reportMemberCheckAll").addEventListener("change", (e) => {
        reportMemberTbody.querySelectorAll("input[type='checkbox']").forEach((cb) => {
            cb.checked = e.target.checked;
        });
    });

    // 8-1. 회원 신고 처리완료 버튼
    reportMemberDoneBtn.addEventListener("click", (e) => {
        const checked = getCheckedRows(reportMemberTbody);
        if (!checked.length) { alert("선택된 항목이 없습니다."); return; }
        if (!confirm(`선택한 ${checked.length}개 신고를 승인하시겠습니까?`)) return;
        alert("승인 처리되었습니다.");
    });

    // 8-2. 회원 신고 반려 버튼
    reportMemberRejectBtn.addEventListener("click", (e) => {
        const checked = getCheckedRows(reportMemberTbody);
        if (!checked.length) { alert("선택된 항목이 없습니다."); return; }
        if (!confirm(`선택한 ${checked.length}개 신고를 반려하시겠습니까?`)) return;
        alert("반려 처리되었습니다.");
    });

    // 8-3. 회원 신고 삭제 버튼
    reportMemberDeleteBtn.addEventListener("click", (e) => {
        const checked = getCheckedRows(reportMemberTbody);
        if (!checked.length) { alert("선택된 항목이 없습니다."); return; }
        if (!confirm(`선택한 ${checked.length}개 신고를 삭제하시겠습니까?`)) return;
        checked.forEach(tr => tr.remove());
    });

    // 8-4. 회원 신고 상태 필터
    filterReportMember.addEventListener("change", (e) => {
        const val = e.target.value;
        reportMemberTbody.querySelectorAll(".div-tr").forEach((tr) => {
            const badge    = tr.querySelector(".div-td:nth-child(6) .badge");
            const badgeCls = badge ? badge.className.split(" ")[1] : "";
            const status   = badgeToStatus(badgeCls) || "";
            if (val === "all" || status === val) {
                tr.classList.remove("off");
            } else {
                tr.classList.add("off");
            }
        });
    });

    // 8-5. 글 신고 전체선택
    document.querySelector("#reportPostCheckAll").addEventListener("change", (e) => {
        reportPostTbody.querySelectorAll("input[type='checkbox']").forEach((cb) => {
            cb.checked = e.target.checked;
        });
    });

    // 8-6. 글 신고 처리완료 버튼
    reportPostDoneBtn.addEventListener("click", (e) => {
        const checked = getCheckedRows(reportPostTbody);
        if (!checked.length) { alert("선택된 항목이 없습니다."); return; }
        if (!confirm(`선택한 ${checked.length}개 신고를 승인하시겠습니까?`)) return;
        alert("승인 처리되었습니다.");
    });

    // 8-7. 글 신고 반려 버튼
    reportPostRejectBtn.addEventListener("click", (e) => {
        const checked = getCheckedRows(reportPostTbody);
        if (!checked.length) { alert("선택된 항목이 없습니다."); return; }
        if (!confirm(`선택한 ${checked.length}개 신고를 반려하시겠습니까?`)) return;
        alert("반려 처리되었습니다.");
    });

    // 8-8. 글 신고 삭제 버튼
    reportPostDeleteBtn.addEventListener("click", (e) => {
        const checked = getCheckedRows(reportPostTbody);
        if (!checked.length) { alert("선택된 항목이 없습니다."); return; }
        if (!confirm(`선택한 ${checked.length}개 신고를 삭제하시겠습니까?`)) return;
        checked.forEach(tr => tr.remove());
    });

    // 8-9. 글 신고 상태 필터
    filterReportPost.addEventListener("change", (e) => {
        const val = e.target.value;
        reportPostTbody.querySelectorAll(".div-tr").forEach((tr) => {
            const badge    = tr.querySelector(".div-td:nth-child(6) .badge");
            const badgeCls = badge ? badge.className.split(" ")[1] : "";
            const status   = badgeToStatus(badgeCls) || "";
            if (val === "all" || status === val) {
                tr.classList.remove("off");
            } else {
                tr.classList.add("off");
            }
        });
    });


    // 9. 회원 신고 행 클릭 → 상세 모달
    // 컬럼: 선택(0)-번호(1)-신고자(2)-신고대상(3)-신고사유(4)-상태(5)-신고일(6)
    reportMemberTbody.addEventListener("click", (e) => {
        if (e.target.type === "checkbox") return;
        const tr = e.target.closest(".div-tr");
        if (!tr) return;
        const tds = tr.querySelectorAll(".div-td");

        document.querySelector("#modalReportTitle").textContent  = "회원 신고 상세";
        document.querySelector("#reportReporter").textContent    = tds[2].textContent;
        document.querySelector("#reportDate").textContent        = tds[6].textContent;
        document.querySelector("#reportTargetLabel").textContent = "피신고자";
        document.querySelector("#reportTarget").textContent      = tds[3].textContent;
        document.querySelector("#reportReason").textContent      = tds[4].textContent;
        document.querySelector("#reportStatusBadge").innerHTML   = tds[5].innerHTML;

        modalReportDetail.classList.remove("off");
    });

    // 9-2. 글 신고 행 클릭 → 상세 모달
    // 컬럼: 선택(0)-번호(1)-신고자(2)-신고글(3)-신고사유(4)-상태(5)-신고일(6)
    reportPostTbody.addEventListener("click", (e) => {
        if (e.target.type === "checkbox") return;
        const tr = e.target.closest(".div-tr");
        if (!tr) return;
        const tds = tr.querySelectorAll(".div-td");

        document.querySelector("#modalReportTitle").textContent  = "글 신고 상세";
        document.querySelector("#reportReporter").textContent    = tds[2].textContent;
        document.querySelector("#reportDate").textContent        = tds[6].textContent;
        document.querySelector("#reportTargetLabel").textContent = "신고 게시물";
        document.querySelector("#reportTarget").textContent      = tds[3].textContent;
        document.querySelector("#reportReason").textContent      = tds[4].textContent;
        document.querySelector("#reportStatusBadge").innerHTML   = tds[5].innerHTML;

        modalReportDetail.classList.remove("off");
    });

    // 9-3. 신고 심사 모달 닫기
    document.querySelector("#modalReportClose").addEventListener("click", (e) => {
        modalReportDetail.classList.add("off");
    });

    document.querySelector("#modalReportCancel").addEventListener("click", (e) => {
        modalReportDetail.classList.add("off");
    });

    modalReportDetail.addEventListener("click", (e) => {
        if (e.target === modalReportDetail) {
            modalReportDetail.classList.add("off");
        }
    });

    // 5-6. 게시물 모달 첨부이미지 클릭 → 이미지 뷰어
    document.querySelector("#postAttachImages").addEventListener("click", (e) => {
        const thumb = e.target.closest(".report-attach-thumb");
        if (!thumb) return;
        document.querySelector("#imgViewerImg").src = thumb.src;
        modalImageViewer.classList.remove("off");
    });

    // 5-7. 게시물 모달 동영상 썸네일 클릭 → 동영상 뷰어
    document.querySelector("#postVideoThumb").addEventListener("click", (e) => {
        modalVideoViewer.classList.remove("off");
    });

    // 동영상 뷰어 닫기
    document.querySelector("#videoViewerClose").addEventListener("click", (e) => {
        document.querySelector("#videoViewerVideo").pause();
        modalVideoViewer.classList.add("off");
    });

    modalVideoViewer.addEventListener("click", (e) => {
        if (e.target === modalVideoViewer) {
            document.querySelector("#videoViewerVideo").pause();
            modalVideoViewer.classList.add("off");
        }
    });

    // 9-3-1. 첨부 이미지 썸네일 클릭 → 이미지 뷰어
    document.querySelector("#reportImages").addEventListener("click", (e) => {
        const thumb = e.target.closest(".report-attach-thumb");
        if (!thumb) return;
        document.querySelector("#imgViewerImg").src = thumb.src;
        modalImageViewer.classList.remove("off");
    });

    // 이미지 뷰어 닫기
    document.querySelector("#imgViewerClose").addEventListener("click", (e) => {
        modalImageViewer.classList.add("off");
    });

    modalImageViewer.addEventListener("click", (e) => {
        if (e.target === modalImageViewer) {
            modalImageViewer.classList.add("off");
        }
    });





    // 10. 뉴스 자동등록 설정 모달
    newsSettingsBtn.addEventListener("click", (e) => {
        modalNewsAutoSettings.classList.remove("off");
    });

    document.querySelector("#modalNewsSettingsClose").addEventListener("click", (e) => {
        modalNewsAutoSettings.classList.add("off");
    });

    document.querySelector("#modalNewsSettingsCancel").addEventListener("click", (e) => {
        modalNewsAutoSettings.classList.add("off");
    });

    modalNewsAutoSettings.addEventListener("click", (e) => {
        if (e.target === modalNewsAutoSettings) {
            modalNewsAutoSettings.classList.add("off");
        }
    });

    document.querySelector("#modalNewsSettingsSave").addEventListener("click", (e) => {
        const isOn   = document.querySelector("#autoRegToggle").checked;
        const ampm   = document.querySelector("#autoRegAmPm").value;
        const hour   = document.querySelector("#autoRegHour").value;
        const minute = document.querySelector("#autoRegMinute").value;
        const resultTime   = `${ampm} ${hour}시 ${minute}분`;
        const result = confirm(`저장하시겠습니까?`);
        if (!result) return;
        alert(isOn ? `${resultTime}에 뉴스가 자동 등록 됩니다.` : "뉴스 자동 등록을 해제 하였습니다.");
        modalNewsAutoSettings.classList.add("off");
    });


    // 11. 뉴스 등록 미리보기 초기화 및 실시간 업데이트

    document.querySelector("#newsTitle").addEventListener("input", (e) => {
        previewTitle.textContent = e.target.value || "제목이 여기에 표시됩니다";
    });

    document.querySelector("#newsCategory").addEventListener("change", (e) => {
        previewCategory.textContent = e.target.value;
    });

    document.querySelector("#newsContent").addEventListener("input", (e) => {
        previewContent.textContent = e.target.value || "내용이 여기에 표시됩니다. AI 요약 또는 직접 입력하면 이곳에 미리보기가 나타납니다.";
    });

    document.querySelector("#newsSource").addEventListener("input", (e) => {
        previewSource.textContent = e.target.value || "출처";
    });


    // 13. 차트 (Google Charts)
    google.charts.load('current', { packages: ['corechart'] });

    let chartsDrawn = false;

    function getLast7Days() {
    const result = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day   = String(date.getDate()).padStart(2, '0');
        result.push(`${month}-${day}`);
    }
    return result;
    }

    function getLast30Days() {
    const result = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day   = String(date.getDate()).padStart(2, '0');
        result.push(`${month}-${day}`);
    }
    return result;
    }

    function get24Hours() {
    const result = [];
    for (let i = 0; i < 24; i++) result.push(i);
    return result;
    }

    function getLastMonths(n = 6) {
    const months = [];
    const now = new Date();

    for (let i = n - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');

        months.push(`${year}-${month}`);
    }

    return months;
    }

    const chartFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

    // 13-1. 회원 추이 - Column Chart
    function drawMemberTrend() {
        let rows;
        if (trendPeriod === '7d') {
            const d = getLast7Days();
            rows = [[d[0],4,1],[d[1],6,3],[d[2],5,2],[d[3],3,0],[d[4],7,2],[d[5],9,1],[d[6],8,0]];
        } else if (trendPeriod === '30d') {
            const d = getLast30Days();
            const g = [3,5,4,3,6,4,2,5,3,4,5,3,4,2,5,6,3,4,5,3,6,4,3,5,4,2,3,5,7,8];
            const t = [1,2,2,1,3,2,1,2,1,2,3,1,2,1,2,3,1,2,2,1,3,2,1,2,2,1,1,2,1,0];
            rows = d.map((day,i) => [day,g[i],t[i]]);
        } else {
            const m = getLastMonths(6);
            rows = [[m[0],98,25],[m[1],110,37],[m[2],88,15],[m[3],92,19],[m[4],115,42],[m[5],88,78]];
        }
        const data = google.visualization.arrayToDataTable([['기간','가입수','탈퇴수']].concat(rows));
        const options = {
            colors: ['#1d9bf0', '#cfd9de'],
            vAxis: { minValue: 0, format: '0', textStyle: { fontSize: 11, color: '#536471' } },
            hAxis: { textStyle: { fontSize: 11, color: '#536471' } },
            legend: { position: 'top', textStyle: { fontSize: 12, color: '#0f1419' } },
            bar: { groupWidth: '65%' },
            chartArea: { left: 55, right: 20, top: 40, bottom: 40 },
            backgroundColor: 'transparent',
            fontName: chartFont,
        };
        new google.visualization.ColumnChart(document.getElementById('chart-member-trend')).draw(data, options);
    }

    // 13-2. 등급 분포 - Donut Chart
    function drawMemberType() {
        const data = google.visualization.arrayToDataTable([
            ['등급',   '회원수'],
            ['free',   1420],
            ['pro',    480],
            ['pro+',   180],
            ['expert', 80],
        ]);
        const options = {
            pieHole: 0.4,
            colors: ['#cfd9de', '#536471', '#0f1419', '#1d9bf0'],
            legend: { position: 'bottom', textStyle: { fontSize: 12, color: '#0f1419' } },
            chartArea: { top: 20, bottom: 50, left: 20, right: 20 },
            backgroundColor: 'transparent',
            pieSliceBorderColor: 'transparent',
            fontName: chartFont,
        };
        new google.visualization.PieChart(document.getElementById('chart-member-type')).draw(data, options);
    }

    // 13-3. 시간대별 이용 - Scatter Chart
    function drawHourly() {
        const h = get24Hours();
        const c7d  = [8,5,3,2,4,10,38,105,210,360,400,375,340,395,425,450,415,470,510,480,435,375,270,110];
        const c30d = [12,8,5,4,6,15,45,120,230,380,420,390,350,410,440,460,430,480,520,490,440,380,280,120];
        const c6m  = [15,10,7,5,8,18,50,130,245,385,425,395,355,415,445,465,435,485,525,495,445,385,285,125];
        const counts = hourlyPeriod === '7d' ? c7d : hourlyPeriod === '30d' ? c30d : c6m;
        const rows = [['시간', '접속수']].concat(h.map((hour, i) => [hour, counts[i]]));
        const data = google.visualization.arrayToDataTable(rows);
        const options = {
            colors: ['#1d9bf0'],
            hAxis: {
                title: '시', minValue: 0, maxValue: 23,
                ticks: [0,3,6,9,12,15,18,21,23],
                textStyle: { fontSize: 11, color: '#536471' },
                titleTextStyle: { fontSize: 12, color: '#536471', italic: false },
            },
            vAxis: {
                title: '접속 수',
                textStyle: { fontSize: 11, color: '#536471' },
                titleTextStyle: { fontSize: 12, color: '#536471', italic: false },
            },
            legend: { position: 'none' },
            pointSize: 6,
            chartArea: { left: 65, right: 20, top: 20, bottom: 50 },
            backgroundColor: 'transparent',
            fontName: chartFont,
        };
        new google.visualization.ScatterChart(document.getElementById('chart-hourly')).draw(data, options);
    }

    // 13-4. 월별 게시글 수 - Column Chart
    function drawPostMonthly() {
        let rows;
        if (postMonthlyPeriod === '7d') {
            const d = getLast7Days();
            const v = [5,8,4,12,9,7,6];
            rows = d.map((day,i) => [day,v[i]]);
        } else if (postMonthlyPeriod === '30d') {
            const d = getLast30Days();
            const v = [4,7,5,9,6,8,4,3,11,8,7,6,9,5,8,10,7,6,4,8,9,5,7,6,8,4,9,6,5,6];
            rows = d.map((day,i) => [day,v[i]]);
        } else {
            const m = getLastMonths(6);
            rows = [[m[0],198],[m[1],225],[m[2],180],[m[3],195],[m[4],260],[m[5],178]];
        }
        const data = google.visualization.arrayToDataTable([['기간','게시글 수']].concat(rows));
        const options = {
            colors: ['#0f1419'],
            legend: { position: 'none' },
            bar: { groupWidth: '65%' },
            vAxis: { minValue: 0, textStyle: { fontSize: 11, color: '#536471' } },
            hAxis: { textStyle: { fontSize: 11, color: '#536471' } },
            chartArea: { left: 55, right: 20, top: 20, bottom: 50 },
            backgroundColor: 'transparent',
            fontName: chartFont,
        };
        new google.visualization.ColumnChart(document.getElementById('chart-post-monthly')).draw(data, options);
    }

    // 13-4-2. 카테고리별 게시글 - Column Chart
    function drawPostCategory() {
        let rows;
        if (postCategoryPeriod === '7d') {
            rows = [['원자재',12,'#0f1419'],['땡땡제품',9,'#536471'],['a제품',6,'#536471'],['기계/설비',5,'#536471'],['화학품',3,'#536471'],['식품',3,'#536471'],['기타',13,'#cfd9de']];
        } else if (postCategoryPeriod === '30d') {
            rows = [['원자재',52,'#0f1419'],['땡땡제품',38,'#536471'],['a제품',25,'#536471'],['기계/설비',22,'#536471'],['화학품',16,'#536471'],['식품',12,'#536471'],['기타',36,'#cfd9de']];
        } else {
            rows = [['원자재',320,'#0f1419'],['땡땡제품',245,'#536471'],['a제품',158,'#536471'],['기계/설비',138,'#536471'],['화학품',100,'#536471'],['식품',76,'#536471'],['기타',149,'#cfd9de']];
        }
        const data = google.visualization.arrayToDataTable([['카테고리','게시글 수',{role:'style'}]].concat(rows));
        const options = {
            legend: { position: 'none' },
            bar: { groupWidth: '60%' },
            vAxis: { minValue: 0, textStyle: { fontSize: 11, color: '#536471' } },
            hAxis: { textStyle: { fontSize: 12, color: '#0f1419' } },
            chartArea: { left: 55, right: 20, top: 20, bottom: 50 },
            backgroundColor: 'transparent',
            fontName: chartFont,
        };
        new google.visualization.ColumnChart(document.getElementById('chart-post-category')).draw(data, options);
    }

    // 13-5. 월별 신고 수 - Column Chart
    function drawReportMonthly() {
        let rows;
        if (reportMonthlyPeriod === '7d') {
            const d = getLast7Days();
            const v = [0,1,2,0,1,1,0];
            rows = d.map((day,i) => [day,v[i]]);
        } else if (reportMonthlyPeriod === '30d') {
            const d = getLast30Days();
            const v = [0,1,0,2,1,0,0,1,0,2,1,0,1,0,1,2,0,1,0,0,1,2,0,1,0,0,1,0,1,0];
            rows = d.map((day,i) => [day,v[i]]);
        } else {
            const m = getLastMonths(6);
            rows = [[m[0],9],[m[1],18],[m[2],14],[m[3],10],[m[4],20],[m[5],13]];
        }
        const data = google.visualization.arrayToDataTable([['기간','신고 수']].concat(rows));
        const options = {
            colors: ['#536471'],
            legend: { position: 'none' },
            bar: { groupWidth: '65%' },
            vAxis: { minValue: 0, textStyle: { fontSize: 11, color: '#536471' } },
            hAxis: { textStyle: { fontSize: 11, color: '#536471' } },
            chartArea: { left: 45, right: 20, top: 20, bottom: 50 },
            backgroundColor: 'transparent',
            fontName: chartFont,
        };
        new google.visualization.ColumnChart(document.getElementById('chart-report-monthly')).draw(data, options);
    }

    // 13-6. 신고 처리 상태 - Donut Chart
    function drawReportStatus() {
        const data = google.visualization.arrayToDataTable([
            ['상태',  '건수'],
            ['심사중', 15],
            ['승인됨', 42],
            ['반려됨', 18],
        ]);
        const options = {
            pieHole: 0.4,
            colors: ['#cfd9de', '#0f1419', '#536471'],
            legend: { position: 'bottom', textStyle: { fontSize: 12, color: '#0f1419' } },
            chartArea: { top: 20, bottom: 50, left: 20, right: 20 },
            backgroundColor: 'transparent',
            pieSliceBorderColor: 'transparent',
            fontName: chartFont,
        };
        new google.visualization.PieChart(document.getElementById('chart-report-status')).draw(data, options);
    }

    // 13-7. 회원 신고 유형 - Donut Chart
    function drawReportMemberType() {
        const data = google.visualization.arrayToDataTable([
            ['유형',      '건수'],
            ['욕설/비방',  28],
            ['사칭',      18],
            ['허위정보',   15],
            ['스팸',       8],
            ['기타',       6],
        ]);
        const donutOptions = {
            pieHole: 0.4,
            colors: ['#0f1419', '#536471', '#cfd9de', '#1d9bf0', '#eff3f4'],
            legend: { position: 'bottom', textStyle: { fontSize: 12, color: '#0f1419' } },
            chartArea: { top: 20, bottom: 50, left: 20, right: 20 },
            backgroundColor: 'transparent',
            pieSliceBorderColor: 'transparent',
            fontName: chartFont,
        };
        new google.visualization.PieChart(document.getElementById('chart-report-member-type')).draw(data, donutOptions);
    }

    // 13-8. 글 신고 유형 - Donut Chart
    function drawReportPostType() {
        const data = google.visualization.arrayToDataTable([
            ['유형',         '건수'],
            ['허위매물',      32],
            ['스팸',          20],
            ['음란물',  12],
            ['차별성 발언',    8],
            ['기타',           6],
        ]);
        const donutOptions = {
            pieHole: 0.4,
            colors: ['#0f1419', '#536471', '#cfd9de', '#1d9bf0', '#eff3f4'],
            legend: { position: 'bottom', textStyle: { fontSize: 12, color: '#0f1419' } },
            chartArea: { top: 20, bottom: 50, left: 20, right: 20 },
            backgroundColor: 'transparent',
            pieSliceBorderColor: 'transparent',
            fontName: chartFont,
        };
        new google.visualization.PieChart(document.getElementById('chart-report-post-type')).draw(data, donutOptions);
    }

    // 통계 차트 lazy draw (portals[6]=회원, [7]=게시글, [8]=신고)
    const drawnPortals = new Set();

    let trendPeriod        = '6m';
    let hourlyPeriod       = '30d';
    let postMonthlyPeriod  = '6m';
    let postCategoryPeriod = '6m';
    let reportMonthlyPeriod = '6m';

    portals[6].addEventListener("click", (e) => {
        if (drawnPortals.has(6)) return;
        drawnPortals.add(6);
        google.charts.setOnLoadCallback(() => { drawMemberTrend(); drawMemberType(); drawHourly(); });
    });

    portals[7].addEventListener("click", (e) => {
        if (drawnPortals.has(7)) return;
        drawnPortals.add(7);
        google.charts.setOnLoadCallback(() => { drawPostMonthly(); drawPostCategory(); });
    });

    portals[8].addEventListener("click", (e) => {
        if (drawnPortals.has(8)) return;
        drawnPortals.add(8);
        google.charts.setOnLoadCallback(() => { drawReportMonthly(); drawReportStatus(); drawReportMemberType(); drawReportPostType(); });
    });

    // 필터바 이벤트 (차트별 독립)
    function bindFilter(id, setFn, drawFn) {
        document.querySelectorAll(`#${id} .stats-filter-btn`).forEach(btn => {
            btn.addEventListener("click", (e) => {
                document.querySelectorAll(`#${id} .stats-filter-btn`).forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                setFn(btn.dataset.period);
                drawFn();
            });
        });
    }

    bindFilter("filterTrend", p => { trendPeriod = p; }, () => {
        if (drawnPortals.has(6)) drawMemberTrend(); });
    bindFilter("filterHourly",  p => { hourlyPeriod = p; }, () => { if (drawnPortals.has(6)) drawHourly(); });
    bindFilter("filterPostMonthly", p => { postMonthlyPeriod = p; },  () => { if (drawnPortals.has(7)) drawPostMonthly(); });
    bindFilter("filterPostCategory", p => { postCategoryPeriod = p; }, () => { if (drawnPortals.has(7)) drawPostCategory(); });
    bindFilter("filterReportMonthly", p => { reportMonthlyPeriod = p; },() => { if (drawnPortals.has(8)) drawReportMonthly(); });

};

