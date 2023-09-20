import React, { useMemo, useRef, useEffect } from "react";
import styled, { css } from "styled-components";


const sharedStyle = css`
  margin-right: 5px;
  padding-right: 3px;
  resize: none;
  outline: none;
  font-family: monospace;
  border-right: 2px solid #DDDDDC;
  font-size: 16px;
  line-height: 1.2;
  &:focus-visible {
    outline: none;
  }
  background-color: #F4F6FA;
`;

const StyledTextareaWrapper = styled.div`
  padding: 15px 0px !important;
  background-color: #F4F6FA;
  border-radius: 4px;
  display: flex;
`;

const StyledNumbers = styled.div`
  ${sharedStyle}
  overflow-y: auto;
  text-align: right;
  box-shadow: none;
  color: grey;
  width: 2rem;
  white-space: nowrap;
  @media screen and (max-width: 768px) {
    width: auto; 
  }
`;


const StyledTextarea = styled.textarea`
  ${sharedStyle}
  width: calc(100% - 2rem);
  border: none;
  &::placeholder {
    color: grey;
  }
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

function Textarea({
  value,
  onValueChange,
  placeholder = "Enter Message",
  name
}) {
  const linesArr = useMemo(() => value.split("\n"), [value]);

  const lineCounterRef = useRef(null);
  const textareaRef = useRef(null);

  const handleTextareaChange = (event) => {
    onValueChange(event.target.value);
  };

  const handleTextareaScroll = () => {
    if (lineCounterRef.current && textareaRef.current) {
      lineCounterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Update line numbers when the component is mounted or the value changes
  useEffect(() => {
    if (lineCounterRef.current) {
      const lineCount = linesArr.length;
      const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);
      lineCounterRef.current.innerHTML = lineNumbers.join("<br>");
    }
  }, [linesArr]);

  return (
    <StyledTextareaWrapper>
      <StyledNumbers ref={lineCounterRef} />
      <StyledTextarea
        name={name}
        onChange={handleTextareaChange}
        onScroll={handleTextareaScroll}
        placeholder={placeholder}
        ref={textareaRef}
        value={value}
        wrap="off"
      />
    </StyledTextareaWrapper>
  );
}

export default Textarea;
