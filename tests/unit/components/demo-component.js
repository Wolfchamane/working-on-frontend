import DemoComponent from '@/components/demo-component';
import renderer from '%/tests/utils/renderer';

describe('DemoComponent', () =>
{
    describe('Snapshot', () =>
    {
        it('Has not being modified', async () =>
            expect(await renderer(DemoComponent, null, true)).toMatchSnapshot());
    });
});
