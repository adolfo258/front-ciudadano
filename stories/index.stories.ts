import { storiesOf, addParameters } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs } from '@storybook/addon-knobs';
import { Welcome, Button } from '@storybook/angular/demo';
import { withA11y } from '@storybook/addon-a11y';

addParameters({
    backgrounds: [{ name: 'dark', value: '#999999', default: true }, { name: 'blue', value: '#3b5998' }]
});

const stories = storiesOf('Welcome', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withA11y);

stories.add('to Storybook', () => ({
    component: Welcome,
    props: {}
}));

storiesOf('Button', module)
    .add('with text', () => ({
        component: Button,
        props: {
            text: 'Hello Button'
        }
    }))
    .add(
        'with some emoji',
        () => ({
            component: Button,
            props: {
                text: '😀 😎 👍 💯'
            }
        }),
        { notes: 'My notes on a button with emojis' }
    )
    .add(
        'with some emoji and action',
        () => ({
            component: Button,
            props: {
                text: '😀 😎 👍 💯',
                onClick: action('This was clicked OMG')
            }
        }),
        { notes: 'My notes on a button with emojis' }
    );

storiesOf('Another Button', module).add('button with link to another story', () => ({
    component: Button,
    props: {
        text: 'Go to Welcome Story',
        onClick: linkTo('Welcome')
    }
}));
