import { serverTimestamp } from "firebase/firestore";

const sampleData = {
  header: {
    name: "My first puzzle",
    author: "Kais",
  },
  contents: [
    {
      category: "Two actors play the same role",
      movies: [
        {
          id: 71880,
          title: "Jack and Jill",
          backdrop:
            "https://image.tmdb.org/t/p/w500/moMs64IweGkJt1pwEAlsAFu3OFt.jpg",
          poster:
            "https://image.tmdb.org/t/p/w500/p6xV65iiz9agN2IAtf7cgbZC3YF.jpg",
        },
        {
          id: 9540,
          title: "Dead Ringers",
          backdrop:
            "https://image.tmdb.org/t/p/w500/n3QtJ6tqE0fnf4Qaxb0iujBk0lH.jpg",
          poster:
            "https://image.tmdb.org/t/p/w500/ofXwDfM8uYAaftD7cBPcIWdCpMn.jpg",
        },
        {
          id: 181886,
          title: "Enemy",
          backdrop:
            "https://image.tmdb.org/t/p/w500/teT1Mo9hZkNCDQ6DFBr5eMJwOpz.jpg",
          poster:
            "https://image.tmdb.org/t/p/w500/coJzyPTkSp4RMRGdgE7pXmJbCiG.jpg",
        },
        {
          id: 453405,
          title: "Gemini Man",
          backdrop:
            "https://image.tmdb.org/t/p/w500/c3F4P2oauA7IQmy4hM0OmRt2W7d.jpg",
          poster:
            "https://image.tmdb.org/t/p/w500/uTALxjQU8e1lhmNjP9nnJ3t2pRU.jpg",
        },
      ],
    },
    {
      category: "Movies in black-and-white and colour",
      movies: [
        {
          id: 872585,
          title: "Oppenheimer",
          backdrop:
            "https://image.tmdb.org/t/p/w500/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg",
          poster:
            "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        },
        {
          id: 630,
          title: "The Wizard of Oz",
          backdrop:
            "https://image.tmdb.org/t/p/w500/nRsr98MFztBGm532hCVMGXV6qOp.jpg",
          poster:
            "https://image.tmdb.org/t/p/w500/pfAZFD7I2hxW9HCChTuAzsdE6UX.jpg",
        },
        {
          id: 424,
          title: "Schindler's List",
          backdrop:
            "https://image.tmdb.org/t/p/w500/zb6fM1CX41D9rF9hdgclu0peUmy.jpg",
          poster:
            "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
        },
        {
          id: 77,
          title: "Memento",
          backdrop:
            "https://image.tmdb.org/t/p/w500/q2CtXYjp9IlnfBcPktNkBPsuAEO.jpg",
          poster:
            "https://image.tmdb.org/t/p/w500/yuNs09hvpHVU1cBTCAk9zxsL2oW.jpg",
        },
      ],
    },
    {
      category: "Sight and Sound top 4",
      movies: [
        {
          id: 44012,
          title: "Jeanne Dielman, 23, quai du Commerce, 1080 Bruxelles",
          backdrop:
            "https://image.tmdb.org/t/p/w500/iIcEswHTHaQOChtSIoylfNGjVz5.jpg",
          poster:
            "https://image.tmdb.org/t/p/w500/yeL8c24oBUQSdms8f7GmRvx3DIZ.jpg",
        },
        {
          id: 426,
          title: "Vertigo",
          backdrop:
            "https://image.tmdb.org/t/p/w500/5zKeHHFYfuyH0KFR7h3IYnOHL7v.jpg",
          poster:
            "https://image.tmdb.org/t/p/w500/15uOEfqBNTVtDUT7hGBVCka0rZz.jpg",
        },
        {
          id: 15,
          title: "Citizen Kane",
          backdrop:
            "https://image.tmdb.org/t/p/w500/ruF3Lmd4A8MHbnEBE6lxPMbsHGL.jpg",
          poster:
            "https://image.tmdb.org/t/p/w500/sav0jxhqiH0bPr2vZFU0Kjt2nZL.jpg",
        },
        {
          id: 18148,
          title: "Tokyo Story",
          backdrop:
            "https://image.tmdb.org/t/p/w500/jLq0ol1f0ZKXni9R9GsPBcyPrNN.jpg",
          poster:
            "https://image.tmdb.org/t/p/w500/g2YbTYKpY7N2yDSk7BfXZ18I5QV.jpg",
        },
      ],
    },
    {
      category: "Directorial debuts by women",
      movies: [
        {
          id: 391713,
          title: "Lady Bird",
          backdrop:
            "https://image.tmdb.org/t/p/w500/pcWxKfFNCznTKYy0E8M9nG1cwL4.jpg",
          poster:
            "https://image.tmdb.org/t/p/w500/iySFtKLrWvVzXzlFj7x1zalxi5G.jpg",
        },
        {
          id: 666277,
          title: "Past Lives",
          backdrop:
            "https://image.tmdb.org/t/p/w500/rron9HAuS9s7zBF8iCX1tsafxUo.jpg",
          poster:
            "https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg",
        },
        {
          id: 93934,
          title: "Je Tu Il Elle",
          backdrop:
            "https://image.tmdb.org/t/p/w500/xzfR4D9G1YpZylwCnBqBznZNkMg.jpg",
          poster:
            "https://image.tmdb.org/t/p/w500/4arnTs41WSLWsnENWdljFKo0pu1.jpg",
        },
        {
          id: 1443,
          title: "The Virgin Suicides",
          backdrop:
            "https://image.tmdb.org/t/p/w500/ojv61rqGQdet3uyc2cY3OmXxkHm.jpg",
          poster:
            "https://image.tmdb.org/t/p/w500/1NCQtXPQnaHRjOZVmktA9BSM35F.jpg",
        },
      ],
    },
  ],
};

export default sampleData;
