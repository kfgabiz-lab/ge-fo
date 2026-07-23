"use client";

import { useEffect, useId, useRef, useState } from "react";
import CommonModal from "@/components/common/CommonModal";
import { fetchData } from "@/lib/pageDataApi";

type PrivacyPolicyModalProps = {
  open: boolean;
  onClose: () => void;
  /** Section guide preview — in-flow layout without fixed overlay */
  embedded?: boolean;
};

// termsMgmt-data flatten 후 root 필드(content = 약관 본문 HTML 문자열, terms.content 스키마)
interface TermsRow {
  content?: string;
}

// 모달 고정 텍스트(값은 기존과 동일: "Privacy Policy" / "Confirm")
const MODAL_TITLE = "Privacy Policy";
const CONFIRM_LABEL = "Confirm";

export default function PrivacyPolicyModal({
  open,
  onClose,
  embedded = false,
}: PrivacyPolicyModalProps) {
  const titleId = useId();

  // 약관 본문 HTML 상태. done 이후 재호출 없이 캐싱된다.
  const [termsHtml, setTermsHtml] = useState<string | null>(null);
  // 재호출 가드는 ref로 관리 — state로 관리하면 그 state 자체가 effect 의존성이 되어
  // "가드 갱신 → effect 재실행 → 방금 시작한 요청을 스스로 취소" 하는 문제가 생긴다.
  const fetchedRef = useRef(false);

  useEffect(() => {
    // 모달이 열릴 때(open===true)만, 아직 조회 전일 때만 1회 호출 → 중복/재호출 방지
    if (!open || fetchedRef.current) return;
    fetchedRef.current = true;
    let cancelled = false;

    // 공통 fetch 계층(fetchData 목록 브랜치) 사용 — 화면 전용 fetch 신규 생성 금지.
    // slug: termsMgmt-data / where: eq_terms.terms_type=1(개인정보) / 최신 1건.
    // 기본 매핑(commonEachData=flattenPageDataItem)이 flatten 수행 → content[0].content 접근 가능.
    fetchData<TermsRow>({
      slug: "termsMgmt-data",
      where: { "eq_terms.terms_type": "1" },
      size: 1,
      page: 0,
      sort: "createdAt,desc",
    })
      .then((res) => {
        if (cancelled) return;
        const html = res.content[0]?.content;
        // 0건/필드 없음 → 빈 본문 폴백(화면 깨짐 방지)
        setTermsHtml(typeof html === "string" ? html : "");
      })
      .catch(() => {
        // 실패도 조용히 빈 본문 폴백(사용자에게 요란한 에러 노출 금지)
        if (!cancelled) setTermsHtml("");
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      embedded={embedded}
      titleId={titleId}
      title={MODAL_TITLE}
      className="privacy_policy_modal"
      footer={
        <button
          type="button"
          className="btn-base btn-lv01 btn-lv01--solid privacy_policy_modal__confirm"
          onClick={onClose}
        >
          {CONFIRM_LABEL}
        </button>
      }
    >
      {/*
        data-slug 바인딩 (단건, STEP1 구조 태깅)
        - slug: termsMgmt-data (PAGE_DATA)
        - where: eq_terms.terms_type=1 (약관유형=개인정보) / 최신 1건
        - 본문 전체가 content(HTML 문자열) 하나로 대체됨
        - content는 bo 어드민이 입력한 신뢰된 약관 HTML → dangerouslySetInnerHTML 사용(사용자 확정 설계, 별도 sanitize 미도입)
      */}
      <div data-slug="termsMgmt-data">
        <div
          data-slugkey="content"
          className="privacy_policy_modal__text"
          dangerouslySetInnerHTML={{ __html: termsHtml ?? "" }}
        />
      </div>
    </CommonModal>
  );
}
