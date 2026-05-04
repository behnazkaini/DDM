import React, { DependencyList, EffectCallback, useEffect, useRef } from 'react';
interface Props { }
function useEffectSkipFirstTime(effect: EffectCallback, deps?: DependencyList) {
	const firstRender = useRef(true);
	useEffect(() => {
		if (!firstRender.current) {
			effect()
		}
	}, deps);

	useEffect(() => {
		firstRender.current = false;
	}, [])
}
export default useEffectSkipFirstTime;