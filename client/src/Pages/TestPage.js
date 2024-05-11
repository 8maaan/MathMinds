import React from 'react';
import TopicsPage from '../ReusableComponents/TopicsPage';

const TestPage = () => {

     const lessonsData = [
        {
          lessonNumber: 1,
          topicNumber: 1,
          title: 'Introduction to SIA',
          content: [
            { type: 'text', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus placerat velit vel nunc dignissim, sit amet eleifend tellus facilisis. Ut vitae justo vitae metus lacinia auctor ac quis felis. Sed id purus nibh. Proin semper rutrum varius. Nullam aliquet quam leo, sit amet tempor lectus mollis sit amet. Aliquam tincidunt turpis eget rutrum placerat.' },
            { type: 'image', imageUrl: 'example.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus placerat velit vel nunc dignissim, sit amet eleifend tellus facilisis. Ut vitae justo vitae metus lacinia auctor ac quis felis. Sed id purus nibh. Proin semper rutrum varius. Nullam aliquet quam leo, sit amet tempor lectus mollis sit amet. Aliquam tincidunt turpis eget rutrum placerat.'},
            { type: 'question',
              question: 'What is SIA?',
              options: ['System IA', 'System integrati A', 'Systems Integration and Architecture'],
              answer: 'Systems Integration and Architecture'
            },
            { type: 'text', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus placerat velit vel nunc dignissim, sit amet eleifend tellus facilisis. Ut vitae justo vitae metus lacinia auctor ac quis felis. Sed id purus nibh. Proin semper rutrum varius. Nullam aliquet quam leo, sit amet tempor lectus mollis sit amet. Aliquam tincidunt turpis eget rutrum placerat.'},
          ],
        },
      ];

    return (  
        <div style={{display: 'flex'}}>
        <TopicsPage lessons={lessonsData}/>    
        </div>
    );
}
 
export default TestPage;