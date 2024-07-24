import React from 'react';
import { Tailwind } from '@fileforge/react-print';
import Latex from 'react-latex'

const PrintContent = ({ title, content }) => {
  return (
    <Tailwind>
      <div className="font-[arial]">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-base">
          {content.split('\n').map((line, index) => (
            <span key={index}>
              <Latex>{line}</Latex>
              <br />
            </span>
          ))}
        </p>
      </div>
    </Tailwind>
  );
};

export default PrintContent;
